/* eslint-disable */
import { React, useState, useEffect, useRef } from 'react';
import ForceGraph from '../graph/graph.js';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import DataGraphUi from './data_graph_ui';
/* eslint-disable react/forbid-prop-types */
export default function DataGraph({
  activeEnteties,
  setPopupData,
  setPopupVisible,
}) {
  // const [graph, setGraph] = useState({});
  const [graphSearch, setGraphSearch] = useState(() => {});

  const graphContainer = useRef(null);

  // Function to process kg_data from API and make it apt for graph_viz package parameters
  const transformData = data => {
    console.log(data)
    const Nodes = [];
    const Edges = [];

    const addEntity = (entity, parent) => {
      console.log('======parent======', parent);
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
        if(item['knowledge graph'].relations[level]) {
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

  useEffect(() => {
    async function initGraph() {
      if (graphContainer.current) {
        d3.select(graphContainer.current).selectAll('svg').remove(); // Destroy method provided by the third-party library
      }

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

      setGraphSearch(() => {
        return instance.search;
      });
      instance.on('nodeClick', e => {
        console.log(e);
        setPopupData(e.clickedNodeData);
        setPopupVisible(true);
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
      <DataGraphUi graphSearch={graphSearch} />
    </div>
  );
}

DataGraph.propTypes = {
  activeEnteties: PropTypes.arrayOf(PropTypes.object),
  setPopupData: PropTypes.func,
  setPopupVisible: PropTypes.func,
};
