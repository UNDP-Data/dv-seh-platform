import { React, useState, useEffect } from 'react';
import ForceGraph from 'graph-viz';
import PropTypes from 'prop-types';
import DataGraphUi from './data_graph_ui';

export default function DataGraph({ setPopupData, setPopupVisible }) {
  // const [graph, setGraph] = useState({});
  const [graphSearch, setGraphSearch] = useState(() => {});

  useEffect(() => {
    async function initGraph() {
      const params = {
        method: 'GET',
        // mode: 'no-cors',
        // credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      };

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
      /* const colors = [
        '#418BFC',
        '#46BCC8',
        '#D6AB1B',
        '#EB5E68',
        '#B6BE1C',
        '#F64D1A',
        '#BA6DE4',
        '#EA6BCB',
        '#B9AAC8',
        '#F08519',
      ]; */
      const resultNodesTrunc = resultNodes.map(d => {
        return {
          NAME: d.entity,
          CATEGORY: d.category,
        };
      });

      const transformedData = [];

      Object.keys(resultEdges).forEach(subject => {
        resultEdges[subject].forEach(
          (relation: { Object: any; Relation: any }) => {
            transformedData.push({
              Object: relation.Object,
              Subject: subject,
              Relation: relation.Relation,
            });
          },
        );
      });

      const instance = ForceGraph(
        { nodes: resultNodesTrunc, links: resultEdges },

        {
          containerSelector: '.graph-container',
          nodeId: 'NAME',
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
      console.log('-----instance------', instance);
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
  }, []);

  return (
    <div className='graph-container' style={{ width: '100%', height: '100%' }}>
      <DataGraphUi graphSearch={graphSearch} />
    </div>
  );
}

DataGraph.propTypes = {
  setPopupData: PropTypes.func,
  setPopupVisible: PropTypes.func,
};
