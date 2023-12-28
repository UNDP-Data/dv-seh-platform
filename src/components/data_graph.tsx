import { useEffect } from 'React';
import ForceGraph from 'undp-energy-graph';
import DataGraphUi from './data_graph_ui';

export default function DataGraph() {
  let graph;
  let graphSearch;
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
        fetch('/energy-entities.json', params),
        fetch('/energy-relations.json', params),
      ]);

      if (!response1.ok || !response2.ok) {
        throw new Error(
          `HTTP error! Status: ${response1.status} ${response2.status}`,
        );
      }

      const resultNodes = await response1.json();
      const resultEdges = await response2.json();

      const colors = [
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
      ];
      const resultNodesTrunc = resultNodes.map(d => {
        return {
          NAME: d.entity,
          CATEGORY: d.category,
        };
      });
      graph = ForceGraph(
        { nodes: resultNodesTrunc, links: resultEdges },
        {
          containerSelector: '.graph-container',
          nodeId: 'NAME',
          sourceId: 'Subject',
          targetId: 'Object',
          nodeGroup: d => d.CATEGORY,
          nodeTitle: d => d.NAME,
          linkStrokeWidth: 1,
          colors,
          width: window.innerWidth,
          height: window.innerHeight,
          labelVisibility: 'visible',
        },
      );
      console.log(graph);
    }
    initGraph();
    console.log(graph);
    // graphSearch = graph.search;
  }, []);

  return (
    <div className='graph-container' style={{ width: '100%', height: '100%' }}>
      <DataGraphUi searchGraph={graphSearch} />
    </div>
  );
}
