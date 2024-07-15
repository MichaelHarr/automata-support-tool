import './App.css';
import 'reactflow/dist/style.css';
import { useCallback, useState, useRef } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, applyNodeChanges, applyEdgeChanges, MarkerType, ReactFlowProvider, Background } from 'reactflow';
import { SmartBezierEdge, SmartStraightEdge, SmartStepEdge } from '@tisoap/react-flow-smart-edge'
import NodeType from "./CircleNode";
import ContextMenu from './ContextMenu'
import { v4 as uuidv4 } from 'uuid';
import InputField from './InputField';

const nodeTypes = {
  circleNode: NodeType
};

const edgeTypes = {
  smart: SmartBezierEdge,
  smartStraight: SmartStraightEdge
}

const initialNodes = [
  { id: '1', position: { x: 200, y: 200 }, data: { label: 'q0', finalState: false, description: '', initialState: true }, type: "circleNode"},
  { id: '2', position: { x: 500, y: 195 }, data: { label: 'q1', finalState: true, description: '', initialState: false }, type: "circleNode" }
];
const initialEdges = [
  { id: 'e1-3', source: '1', target: '2', label: '1', markerEnd: {type: MarkerType.ArrowClosed, width: 20, height: 20}, style:  {strokeWidth: 2}},
];


const App = () => {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);

  const [inputString, setInputString] = useState('');

  const [selectedEdge, setSelectedEdge] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const [currentState, setCurrentState] = useState(nodes.find(node => node.id === '1'));
  const [isAccepted, setIsAccepted] = useState(false);
  const [outputMessage, setOutputMessage] = useState(""); 

  const [menu, setMenu] = useState(null);
  const ref = useRef(null);

  const onConnect = (params) => {
    const newEdge = {
      ...params,
      id: (edges.length + 1).toString(),
      markerEnd: {type: MarkerType.ArrowClosed, width: 20, height: 20}, 
      style:  {strokeWidth: 2},
      type: params.source == params.target? "smart" : ""
    }; 

    setEdges((prevElements) => [...prevElements, newEdge]);
  };

  // - - - - - - - - - - - - - - - 
  // Handling uodates for the nodes 
  // - - - - - - - - - - - - - - -
  const handleNodeChange = useCallback(
    (changes) => {
      setNodes((nds) => {
        const updatedNodes = applyNodeChanges(changes, nds);
        updateSelectedNode(updatedNodes);
        return updatedNodes;
      });
    },
    [setNodes],
  );

  const updateSelectedNode = (nodes) => {
    const node = nodes.find(node => node.selected);
    if (node) {
      setSelectedNode(node);
    } else {
      setSelectedNode(null);
    }
  };

  const handleDescriptionChange = (evt) => {
    const description = evt.target.value;
  
    setNodes((nds) => {
      return nds.map((node) => {
        if (node.id === selectedNode.id) {
          node.data = {
            ...node.data,
            description: description,
          };
        }
        return node;
      });
    });
  };

  const handleNodeLabelChange = (evt) => {
    const label = evt.target.value;
  
    setNodes((nds) => {
      return nds.map((node) => {
        if (node.id === selectedNode.id) {
          node.data = {
            ...node.data,
            label: label,
          };
        }
        return node;
      });
    });
  };

  // - - - - - - - - - - - - - - - 
  // Handling uodates for the edges 
  // - - - - - - - - - - - - - - -
  const handleEdgeChange = useCallback(
    (changes) => {
      setEdges((eds) => {
        const updatedEdges = applyEdgeChanges(changes, eds);
        updateSelectedEdge(updatedEdges);
        return updatedEdges;
      });
  }, [setEdges]);

  const updateSelectedEdge = (edges) => {
    const edge = edges.find(edge => edge.selected);
    if (edge) {
      setSelectedEdge(edge);
    } else {
      setSelectedEdge(null);
    }
  };

  const handleEdgeLabelChange = (evt) => {
    const label = evt.target.value;
    
    setEdges((eds) => {
      return eds.map((edge) => {
        if (edge.id === selectedEdge?.id) {
          edge.label = label;
        }
        return edge;
      });
    });
  };

  const addCircleNode = () => {
    const newNode = {
      id: uuidv4(),
      data: { label: `q${nodes.length}`, finalState: false, description: '', initialState: false },
      type: "circleNode",
      position: {
        x: 0,
        y: 200,
      },
      padding: "14px",
      borderRadius: "50%",
      'data-testid': 'node'
    };
    setNodes((prevElements) => [...prevElements, newNode]);
  }

  const checkInputString = (inputString) => {
    let currentStateCopy = currentState;

    let transitionFound = true

    for (const symbol of inputString) {

      const transition = edges.find((edge) => edge.source === currentStateCopy.id && edge.label === symbol);

      if (transition) {
        currentStateCopy = nodes.find(node => node.id === transition.target);
      } else {
        console.log("No Transition Found");
        transitionFound = false
      }
      console.log("CurrentStateCopy: ", currentStateCopy);
    }

    const isSuccess = transitionFound && currentStateCopy.data.finalState;
    setIsAccepted(isSuccess);
    setOutputMessage(isSuccess ? "Pass" : "Fail");
  }

  const onNodeContextMenu = useCallback(
    (event, node) => {
      setSelectedNode(node);

      event.preventDefault();

      const pane = ref.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        top: event.clientY - 50,
        left: event.clientX - 500,
        data: node.data,
        currentState: setCurrentState,
        getCurrentState: currentState
      });
      console.log(node.data);
    },
    [setMenu],
  );

  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  return (
    <div className="full-screen">
      <h1 className="text-5xl font-extrabold dark:text-white">Automata Simulator</h1>
      <p>A web application for creating and simulating finite state automata</p>
      <ReactFlowProvider>
        <div className="flex-grow">
          <div className="flex flex-grow">
            <div className="w-1/5 p-4" style={{ border: '1px solid black' }}>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" onClick={() => addCircleNode()}>Add Node</button><br/>
              <label className="font-extrabold dark:text-white">Input String: </label>
              <InputField inputString={inputString} setInputString={setInputString} isAccepted={isAccepted}></InputField>
              <div className="font-extrabold flex align-middle" style={{ color: isAccepted ? 'green' : 'red' }}>{outputMessage}</div>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" onClick={() => checkInputString(inputString)}>Check Input</button>
            </div>
            <div className="flex-grow relative" style={{ border: '1px solid black' }}>
              <ReactFlow
                ref={ref}
                nodes={nodes}
                edges={edges}
                onNodesChange={handleNodeChange}
                onEdgesChange={handleEdgeChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodeContextMenu={onNodeContextMenu}
              >
                <Background />
                {menu && <ContextMenu onClick={onPaneClick} {...menu} setCurrentState={setCurrentState} />}
              </ReactFlow>
            </div>
            <div className="w-1/5 p-4" style={{ border: '1px solid black' }}>
              {selectedNode ? (
                <div style={{ border: '1px solid black' }}>
                  <div style={{ border: '1px solid black' }}>State: {selectedNode.data.label}</div>
                  <div style={{ border: '1px solid black' }}>Label:
                    <textarea
                      className='outline-none'
                      style={{ width: '100%', backgroundColor: '#EFFAFD' }}
                      value={selectedNode.data.label}
                      onChange={handleNodeLabelChange}></textarea>
                  </div>
                  <div style={{ border: '1px solid black' }}>Description:
                    <textarea
                      className='outline-none'
                      style={{ width: '100%', backgroundColor: '#EFFAFD' }}
                      value={selectedNode.data.description}
                      onChange={handleDescriptionChange}></textarea>
                  </div>
                </div>
              ) : null}

              {selectedEdge ? (
                <div style={{ border: '1px solid black' }}>
                  <div style={{ border: '1px solid black' }}>Edge: {nodes.find(node => node.id === selectedEdge.source).data.label} - {nodes.find(node => node.id === selectedEdge.target).data.label}</div>
                  <div style={{ border: '1px solid black' }}>Label:
                    <textarea
                      className='outline-none'
                      style={{ width: '100%', backgroundColor: '#EFFAFD' }}
                      maxLength="1"
                      value={selectedEdge.label}
                      onChange={handleEdgeLabelChange}></textarea>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div>
          <h3 className="pt-5 pb-3 text-3xl font-extrabold dark:text-white">Guide:</h3>
          <p className="font-bold">Add Node button above creates a new state</p>
          <p className="font-bold">Click on transition to edit its symbol in text input above</p>
          <br />
          <p className="font-bold">Right Click a state to toggle what type of state it is:</p>
          <p className="font-normal">Green state = initial state</p>
          <p className="font-normal">Extra ring = final state</p>
          <br />
          <p className="font-bold">Clicking on state allows you to edit its description on the right</p>
          <p className="font-bold">Left side allows for checking what inputs are accepted by the automaton</p>
          <br />
          <p className="font-bold pb-12">Non-Deterministic Automata not currently supported</p>
          <br />
          <br />
        </div>
      </ReactFlowProvider>
    </div>
  )
}


export default App;
