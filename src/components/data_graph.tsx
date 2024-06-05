import { React, useState, useEffect, useRef } from 'react';
import ForceGraph from 'graph-viz';
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
    const transformedEdgeData = {};
    const entitiesSet = new Set();
    const entitiesArray = [];

    const addEntity = (entity, category) => {
      if (!entitiesSet.has(entity)) {
        entitiesSet.add(entity);
        entitiesArray.push({ entity, category });
      }
    };

    data.forEach(item => {
      const entity = item.metadata.Entity;

      // Add metadata entity to entitiesArray
      addEntity(entity, item.metadata.Category);

      // Handle level 1 relations
      if (!transformedEdgeData[entity]) {
        transformedEdgeData[entity] = [];
      }
      transformedEdgeData[entity].push(
        ...item['knowledge graph'].relations['level 1'].map(relation => ({
          Description: relation.Description,
          Importance: relation.Importance,
          Object: relation.Object,
          Relation: relation.Relation,
        })),
      );

      // Add each object in level 1 relations as entity with category 'Renewable energy'
      item['knowledge graph'].relations['level 1'].forEach(relation => {
        addEntity(relation.Object, 'Renewable energy');
      });

      // Handle level 2 and level 3 relations
      ['level 2', 'level 3'].forEach(level => {
        item['knowledge graph'].relations[level].forEach(relations => {
          const subject = relations.Subject || entity;
          if (!transformedEdgeData[subject]) {
            transformedEdgeData[subject] = [];
          }
          transformedEdgeData[subject].push({
            Description: relations.Description,
            Importance: relations.Importance,
            Object: relations.Object,
            Relation: relations.Relation,
          });

          // Add each object in level 2 and level 3 relations as entity with category 'Renewable energy'
          addEntity(relations.Object, 'Renewable energy');
          addEntity(relations.Subject, 'Renewable energy');
        });
      });
    });

    return { transformedEdgeData, entitiesArray };
  };

  useEffect(() => {
    async function initGraph() {
      if (graphContainer.current) {
        d3.select(graphContainer.current).selectAll('svg').remove(); // Destroy method provided by the third-party library
      }

      const params = {
        method: 'GET',
        // mode: 'no-cors',
        // credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      /* replace /energy-entities-small.json 
          with /energy-entities.json file
          when larger graph is needed with all entities */
      console.log('----activeEnteties----', activeEnteties);
      const [response1, response2] = await Promise.all([
        fetch('/energy-entities-small.json', params),
        fetch('/energy-relations-small.json', params),
      ]);

      if (!response1.ok || !response2.ok) {
        throw new Error(
          `HTTP error! Status: ${response1.status} ${response2.status}`,
        );
      }

      // uncomment below two lines when need to use hard coded data from.json file
      const resultNodes = await response1.json();
      const resultEdges = await response2.json();

      console.log('========Nodes', resultNodes);
      console.log('========Edges', resultEdges);
      const { transformedEdgeData, entitiesArray } =
        transformData(activeEnteties);
      console.log('New Function output----', transformedEdgeData);
      console.log('New Function output entitiesArray----', entitiesArray);

      const instance = ForceGraph(
        { nodes: entitiesArray, links: transformedEdgeData },

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
