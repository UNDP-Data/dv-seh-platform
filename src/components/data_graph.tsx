/* eslint-disable */
import { React, useState, useEffect, useRef } from 'react';
import ForceGraph from '../graph/graph.js';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import DataGraphUi from './data_graph_ui';

const params = {
  method: 'GET',
};
/* eslint-disable react/forbid-prop-types */
export default function DataGraph({
  activeEnteties,
  setPopupData,
  setPopupVisible,
}) {
  // const [graph, setGraph] = useState({});
  const [error, setError] = useState(null);

  const graphContainer = useRef(null);

  // Function to process kg_data from API and make it apt for graph_viz package parameters
  const transformData = data => {
    console.log(data);
    const Nodes = [];
    const Edges = [];

    const addEntity = (entity, parent) => {
      // Check if the entity is already present in the newentitiesArray
      if (Nodes.map(el => el.entity).indexOf(entity) === -1) {
        Nodes.push({
          entity,
          type: 'main',
          parent,
        });
      }
    };

    data.forEach(item => {
      const entity = item.metadata.Entity;

      // Add metadata entity to nodes if not already present
      if (Nodes.map(el => el.entity).indexOf(entity) === -1) {
        Nodes.push({
          entity,
          type: 'main',
          root: true,
          parent: entity,
        });
      }

      // let links = data['knowledge graph'].relations
      // links.forEach(d => {
      //   if(Nodes.map(el => el.entity).indexOf(d.Subject) === -1) {
      //     Nodes.push({entity: d.Subject, type: 'main', parent: entity})
      //   }
      //   if(Nodes.map(el => el.entity).indexOf(d.Object) === -1) {
      //     Nodes.push({entity: d.Object, type: 'main', parent: entity})
      //   }
      // })

      // Handle level 1, 2, and 3 relations
      ['level 1', 'level 2', 'level 3'].forEach(level => {
        if (item['knowledge graph'].relations[level]) {
          item['knowledge graph'].relations[level].forEach(relation => {
            const subject = relation.Subject || entity;
            const object = relation.Object;

            // Add relation as link
            Edges.push({
              Object: object,
              Subject: subject,
              Relation: relation.Relation,
              Description: relation.Description,
              Importance: relation.Importance,
            });

            // Add each object and subject in relations as entity with category 'Renewable energy'
            addEntity(object, entity);
            addEntity(subject, entity);
          });
        }
      });
    });

    // Log the entities for debugging
    console.log('Entities Array:', Nodes);
    console.log('Edges Array:', Edges);

    return { Nodes, Edges };
  };

  async function updateEntityGraph(entities) {
    try {
      setError(null);
      console.log('---inside updateEntityGraph---', entities);
      let fetchReqs = [];
      entities.forEach(d => {
        const entity = d.replaceAll(' ', '%20');
        fetchReqs.push(
          fetch(
            `https://raw.githubusercontent.com/UNDP-Data/dsc-energy-knowledge-graph/main/00_API/${entity}.json`,
            params,
          ),
        );
      });
      console.log('---fetchReqs---', fetchReqs);

      // Extract new entity json from github
      const responses = await Promise.all(fetchReqs);
      console.log('---responses---', responses);

      const dataPromises = responses.map(async response => {
        console.log('---each response---', response);
        if (response.status === 404) {
          throw new Error('Please enter valid entity');
        }
        const result = await response.json();
        console.log('---result---', result);
        const entity = result['metadata']['Entity Code'];

        let nodes = [];

        let entities = result['knowledge graph'].entities;
        entities.map(d => {
          nodes.push({
            entity: d['Entity Code'],
            type: 'main',
            parent: entity,
          });
        });
        nodes.push({ entity, type: 'main', root: true, parent: entity });

        let links = result['knowledge graph'].relations;
        links.forEach(d => {
          if (nodes.map(el => el.entity).indexOf(d.Subject) === -1) {
            nodes.push({ entity: d.Subject, type: 'main', parent: entity });
          }
          if (nodes.map(el => el.entity).indexOf(d.Object) === -1) {
            nodes.push({ entity: d.Object, type: 'main', parent: entity });
          }
        });

        let sub_entities = result['knowledge graph']['sub-elements'];
        sub_entities.map(d => {
          nodes.push({ entity: d, type: 'sub', parent: entity });
        });

        // Returning the constructed nodes and links for each entity
        return { nodes, links };
      });

      // Wait for all data promises to resolve
      const dataArray = await Promise.all(dataPromises);

      // Flatten the array of nodes and links
      const flatNodes = dataArray.flatMap(data => data.nodes);
      const flatEdges = dataArray.flatMap(data => data.links);

      return { nodes: flatNodes, links: flatEdges };
    } catch (err) {
      console.log('Error updating entity graph:', err);
      setError(err.message);
      return { nodes: [], links: [] }; // Return empty nodes and links in case of an error
    }
  }

  useEffect(() => {
    async function initGraph() {
      if (graphContainer.current) {
        d3.select(graphContainer.current).selectAll('svg').remove(); // Destroy method provided by the third-party library
      }
      setError(null);
      const { Nodes, Edges } = transformData(activeEnteties);

      const instance = ForceGraph(
        { nodes: Nodes, links: Edges },

        {
          containerSelector: '.graph-container',
          nodeId: 'entity',
          sourceId: 'Subject',
          targetId: 'Object',
          width: window.innerWidth,
          height: window.innerHeight,
          nodeStyles: {
            strokeWidth: 2,
          },
          linkStyles: {
            strokeWidth: 1.5,
          },
          labelStyles: {
            visibility: 'visible',
            label: 'entity',
            edge: {
              visibility: 'hidden',
              label: 'Relation',
            },
          },
          containerStyles: {
            'background-color': '#212121',
          },
        },
      );
      // setGraph(() => {
      //   return instance;
      // });
      /* instance.on('nodeClick', async event => {
        console.log(event);
        setPopupData(event.clickedNodeData);
        setPopupVisible(true);
        const { nodes: newNodes, links: newLinks } = await updateEntityGraph([
          event.clickedNodeData.entity,
        ]);
        console.log('----newNodes----', newNodes);
        console.log('----newLinks----', newLinks);
        instance.update({
          nodes: newNodes,
          links: newLinks
        })
      }); */
      instance.on('nodeClick', async event => {
        console.log('Node clicked Data:', event.clickedNodeData);
        const { nodes: newNodes, links: newLinks } = await updateEntityGraph([
          event.clickedNodeData.entity,
        ]);
        instance.update({
          nodes: newNodes,
          links: newLinks,
        });
      });

      const searchInput = document.getElementById('search-input');
      searchInput.addEventListener('keydown', async function (event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
          const { nodes: newNodes, links: newLinks } = await updateEntityGraph([
            searchInput.value,
          ]);
          console.log('post search----', newNodes, newLinks);
          searchInput.value = '';
          if (newNodes.length > 0 && newLinks.length > 0) {
            instance.update({
              nodes: newNodes,
              links: newLinks,
            });
          }
        }
      });
    }
    initGraph();
  }, [activeEnteties]);

  return (
    <div
      ref={graphContainer}
      className='graph-container'
      style={{ width: '100%', height: '100%' }}
    >
      <div id='search-container' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <input type='text' id='search-input' placeholder='Search for entity' style={{ marginBottom: '10px' }} />
        {error && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

DataGraph.propTypes = {
  activeEnteties: PropTypes.arrayOf(PropTypes.object),
  setPopupData: PropTypes.func,
  setPopupVisible: PropTypes.func,
};
