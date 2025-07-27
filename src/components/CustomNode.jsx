import { Settings, Settings2 } from 'lucide-react';
import { useState } from 'react';
import { Handle, Position } from 'reactflow';
//creating a custom node because default node has handles on top and bottom...
export default function CustomNode({ data }) {
  const [hovered, setHovered] = useState(false);
//added delete functionality to the custom node
  const deleteNode = () => {
    data.setNodes((nds) => nds.filter((node) => node.id !== data.nodeId));
    data.setEdges((eds) =>
      eds.filter((edge) => edge.source !== data.nodeId && edge.target !== data.nodeId)
    );
  };

  return (
    <div
      className="border rounded shadow p-2 relative bg-gray-600"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#f87171', width: 8, height: 50 }}
/>
      <div className="text-sm flex justify-center items-center">{data.label}<Settings className='text-white h-6 w-6  m-2' /></div>
      <Handle type="source" position={Position.Right}  style={{ background: '#34d399', width: 8, height: 50 }}/>

      {hovered && (
        <button
          onClick={deleteNode}
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full hover:bg-red-700"
        >
          ✕
        </button>
      )}

      {/* {hovered && (
        <button
          // onClick={}
          className="absolute top-6 right-2 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full hover:bg-red-700"
        >
          <Settings className='text-white h-2 w-2 bg-gray-600' />
        </button>
      )} */}
      
    </div>
  );
}
