import { useCallback, useState } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
} from 'reactflow';

import CustomNode from './components/CustomNode';
import 'reactflow/dist/style.css';
import './App.css';

const nodeTypes = {
  custom: CustomNode,
};
//nodes and edges initial state 
//states of nodes and edges
const initialNodes = [];
const initialEdges = [];

function App() {
  //some hooks from react-flow..
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);


  const onConnect = useCallback(
  (params) => {
    setEdges((eds) => addEdge(params, eds));
  },
  []
);

//on dropping of a card in the react flow canvas
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const data = event.dataTransfer.getData('application/reactflow');
      if (!data) return;

      const message = JSON.parse(data);
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
          id: `${+new Date()}`,
          type: 'custom',
          position,
          data: {
            label: message.message,
            nodeId: `${+new Date()}`, // needed for deletion
            setNodes,
            setEdges,
          },
};
      setNodes((nds) => [...nds, newNode]);
    },
    //set new state of nodes..
    [setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
//hard coded data for cards..
  const messages = [
    { id: 1, message: 'Hi how are you doing?', userName: 'Biswajit1' },
    { id: 2, message: 'I’m doing great, thanks!', userName: 'Alice' },
    { id: 3, message: 'What about you?', userName: 'Bob' },
    { id: 4, message: 'I’m learning React Flow today.', userName: 'Biswajit2' },
    { id: 5, message: 'That’s awesome!', userName: 'Charlie' },
    { id: 6, message: 'Yes, it’s really fun.', userName: 'Biswajit3' },
    { id: 7, message: 'Do you need any help?', userName: 'Alice' },
    { id: 8, message: 'Maybe later, thank you.', userName: 'Biswajit4' },
    { id: 9, message: 'Good luck with your project!', userName: 'Bob' },
    { id: 10, message: 'Thanks a lot!', userName: 'Biswajit5' },
  ];
// for drag and drop inside this rect flo wcanva
  const handleDragStart = (event, node) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(node));
    event.dataTransfer.effectAllowed = 'move';
  };

// validation logic used react flow inbuilt variables for finding the logic
  const validate = () => {
      const nodeIds = nodes.map((n) => n.id);
      const connectedNodeIds = new Set();

      edges.forEach((e) => {
        connectedNodeIds.add(e.source);
        connectedNodeIds.add(e.target);
      });

      const unconnected = nodeIds.filter((id) => !connectedNodeIds.has(id));
      const multipleOutgoing = nodes.filter((n) => {
        const outgoing = edges.filter((e) => e.source === n.id);
        return outgoing.length > 1;
      });

      if (unconnected.length > 0) {
        alert(`Validation failed: ${unconnected.length} unconnected node(s).`);
        return false;
      } else if (multipleOutgoing.length > 0) {
        alert(`Validation failed: A node has more than one outgoing edge.`);
        return false;
      } else {
        alert("Validation passed. All nodes are connected correctly.");
        return true;
      }
    }
    const save = () => {
  const isValid = validate();
  if (!isValid) return;

  const flowData = {
    nodes,
    edges,
  };
  console.log("Saved Data: ", flowData);
  alert("Flow data saved to console!");
};
  return (
    <div className='flex flex-col h-[90vh] m-4 bg-neutral-600/60 p-5 '>
  <h1 className='text-xl font-bold mb-4'>BiteSpeed Assignment: Frontend Developer Role</h1>

  <div className='mb-4'>
    <button onClick={validate} className='m-2 border p-2 rounded-2xl bg-gray-600 hover:text-white hover:bg-black'>
      Validate
    </button> 
    <button onClick={save} className='m-2 border p-2 rounded-xl bg-green-400 hover:bg-green-800 hover:text-white'> 
      Save
    </button>
  </div>

  {/* Main Layout */}
  <div className='flex flex-1 min-h-0'>
    {/* Left: Flow Canvas */}
    <div
      className='w-3/4 border-2 rounded-4xl p-2 mr-2 bg-white relative'
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        zoomOnScroll={false}
        zoomOnPinch={false}
        panOnScroll={false}
        zoomOnDoubleClick={false}
        panOnDrag={true}
        defaultViewport={{ x: 0, y: 0, zoom: 0.20 }}
        onNodeClick={(e, node) => {
          e.preventDefault();
          setSelectedNode(node);
        }}
        onPaneClick={() => setSelectedNode(null)}
        className='dark dark:bg-gray-800 rounded-4xl'
      >
        
        <Background />
        <Controls />
      </ReactFlow>
    </div>

    {/* Right: Settings or Nodes Panel */}
    <div className='w-1/4 border-2 rounded-4xl p-4 overflow-y-auto bg-gray-50'>
      {selectedNode ? (
        <div>
          <h2 className='text-lg font-bold mb-2'>Settings Panel</h2>
          <label className='block text-sm mb-1'>Edit Message:</label>
          <input
            type='text'
            className='w-full p-2 border rounded mb-4'
            value={selectedNode.data.label}
            onChange={(e) => {
              const updatedNodes = nodes.map((node) =>
                node.id === selectedNode.id
                  ? {
                      ...node,
                      data: { ...node.data, label: e.target.value },
                    }
                  : node
              );
              setNodes(updatedNodes);
              setSelectedNode((prev) => ({
                ...prev,
                data: { ...prev.data, label: e.target.value },
              }));
            }}
          />
          <button
            onClick={() => setSelectedNode(null)}
            className='text-sm text-blue-600 hover:underline'
          >
            ← Back to Nodes Panel
          </button>
        </div>
      ) : (
        <>
          <h2 className='text-lg font-bold mb-2'>Nodes Panel</h2>
          {messages.map((item) => (
            <div
              key={item.id}
              className='border p-2 mb-2 bg-white rounded shadow cursor-pointer'
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
            >
              <p className='text-sm'>{item.message}</p>
              <p className='text-xs text-gray-500'>— {item.userName}</p>
            </div>
          ))}
        </>
      )}
    </div>
  </div>
</div>

  );
}

export default App;
