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
    const entitiesArray = [];
    const edgeArray = [];
    const entitiesSet = new Set();

    const addEntity = (entity, category) => {
      if (!entitiesSet.has(entity)) {
        entitiesSet.add(entity);
        entitiesArray.push({ entity, category });
      }
    };

    data.forEach(item => {
      const entity = item.metadata.Entity;
      const category = item.metadata.Category;

      // Add metadata entity to nodes
      addEntity(entity, category);

      // Handle level 1, 2, and 3 relations
      ['level 1', 'level 2', 'level 3'].forEach(level => {
        item['knowledge graph'].relations[level].forEach(relation => {
          const subject = relation.Subject || entity;
          const object = relation.Object;

          // Add relation as link
          edgeArray.push({
            Object: object,
            Subject: subject,
            Relation: relation.Relation,
            Description: relation.Description,
            Importance: relation.Importance,
          });

          // Add each object and subject in relations as entity with category 'Renewable energy'
          addEntity(object, 'Renewable energy');
          addEntity(subject, 'Renewable energy');
        });
      });
    });

    return { entitiesArray, edgeArray };
  };

  useEffect(() => {
    async function initGraph() {
      if (graphContainer.current) {
        d3.select(graphContainer.current).selectAll('svg').remove(); // Destroy method provided by the third-party library
      }

      const { edgeArray, entitiesArray } = transformData(activeEnteties);
      console.log('New Function output----', edgeArray);
      console.log('New Function output entitiesArray----', entitiesArray);

      const instance = ForceGraph(
        { nodes: entitiesArray, links: edgeArray },

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
