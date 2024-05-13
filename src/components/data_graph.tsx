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

  useEffect(() => {
    async function initGraph() {
      console.log(graphContainer, d3);
      /*
      if (graphContainer.current) {
        d3.select(graphContainer.current).selectAll('svg').remove(); // Destroy method provided by the third-party library
      } */

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

      const resultNodes = await response1.json();
      const resultEdges = await response2.json();

      const realEdgedata = {};
      const realEntityData = [];

      activeEnteties.forEach(entry => {
        // Correct the scope and declaration of relations
        const { relations } = entry['knowledge graph'];
        Object.keys(relations).forEach(subject => {
          realEdgedata[subject] = relations[subject];
          relations[subject].forEach(relation => {
            // Check and push subject to realEntityData if not present
            if (!realEntityData.some(item => item.entity === subject)) {
              realEntityData.push({
                entity: subject,
                category: 'Renewable energy', // Assuming all subjects fall under this category
              });
            }

            // Check and push relation.Object to realEntityData if not present
            if (!realEntityData.some(item => item.entity === relation.Object)) {
              realEntityData.push({
                entity: relation.Object,
                category: 'Renewable energy', // Assuming all relation objects fall under this category
              });
            }
          });
        });
      });

      console.log('----resultNodes---', resultNodes);
      console.log('----resultEdges---', resultEdges);

      console.log('----realEntityData---', realEntityData);
      console.log('----realEdgedata---', realEdgedata);

      const instance = ForceGraph(
        { nodes: realEntityData, links: realEdgedata },

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
