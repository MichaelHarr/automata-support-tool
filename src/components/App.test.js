// Import ResizeObserver from a module that exports a mock implementation
import { ResizeObserver } from '@juggle/resize-observer';
//import { fireEvent, screen } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider as ZustandProvider } from 'zustand'; // Import the Zustand provider
// Assign the mock implementation to the global scope
global.ResizeObserver = ResizeObserver;

// Import render from '@testing-library/react' after setting up the mock
import { render } from '@testing-library/react';
import App from './App';
import ContextMenu from './ContextMenu';

// Mock the useReactFlow hook

describe('App component', () => {
 test('it renders', () => {
   render(<App />);
 });

 test('renders Automata Simulator header', () => {
  const { getByText } = render(<App />);
  const headerElement = screen.getByText(/Automata Simulator/i);
  expect(headerElement).toBeInTheDocument();
});

test('adds a new node on Add Node button click', () => {

  // render application
  render(<App />);

  // get number of initial nodes
  const initialNodes = screen.getAllByTestId('testNode');
  const initialNodesCount = initialNodes.length;
  
  // add new node
  const addNodeButton = screen.getByText('Add Node');
  fireEvent.click(addNodeButton);
  
  // Get the updated number of nodes
  const updatedNodes = screen.getAllByTestId('testNode');
  const updatedNodesCount = updatedNodes.length;
  
  // Assert that the number of nodes has increased
  expect(updatedNodesCount).toBe(initialNodesCount + 1);
});

test('adds a new edge', () => {

  // render application
  render(<App />);

  // get number of initial nodes
  const initialNodes = screen.getAllByTestId('testNode');
  const initialNodesCount = initialNodes.length;
  
  // add new node
  const addNodeButton = screen.getByText('Add Node');
  fireEvent.click(addNodeButton);
  
  // Get the updated number of nodes
  const updatedNodes = screen.getAllByTestId('testNode');
  const updatedNodesCount = updatedNodes.length;
  
  // Assert that the number of nodes has increased
  expect(updatedNodesCount).toBe(initialNodesCount + 1);
});

// test('deletes a node on Delete button click', () => {

//   // render application
//   render(
//       <App />
//   );

//   // get number of initial nodes
//   const initialNodes = screen.getAllByTestId('testNode');
//   const initialNodesCount = initialNodes.length;
  
//   // Mock necessary props for ContextMenu component
//   const mockProps = {
//     id: '1',
//     top: 100,
//     left: 100,
//     data: { label: 'Some Label' },
//     setCurrentState: jest.fn(),
//     getCurrentState: initialNodes.at(0),
//   };

//   // Render the ContextMenu component with mockProps
//   const { getByText } = render(<ContextMenu {...mockProps} />);

//   // Get the Delete button by its text content
//   const deleteButton = getByText('Delete');

//   // Simulate a click event on the Delete button
//   fireEvent.click(deleteButton);
  
//   // Get the updated number of nodes
//   const updatedNodes = screen.getAllByTestId('testNode');
//   const updatedNodesCount = updatedNodes.length;
  
//   // Assert that the number of nodes has increased
//   expect(updatedNodesCount).toBe(initialNodesCount - 1);
  
// });

});

// describe('ContextMenu', () => {
//   test('renders the context menu with correct buttons', () => {
//     // Mock props
//     const mockProps = {
//       id: '1',
//       top: 100,
//       left: 100,
//       data: { label: 'Some Label' },
//       setCurrentState: jest.fn(),
//       getCurrentState: jest.fn(),
//     };

//     // Render the component with mock props
//     const { getByText } = render(<ContextMenu {...mockProps} />);

//     // Check if the component renders correctly
//     expect(getByText('State: Some Label')).toBeInTheDocument();
//     expect(getByText('Delete')).toBeInTheDocument();
//     expect(getByText('Toggle Final State')).toBeInTheDocument();
//     expect(getByText('Toggle Initial State')).toBeInTheDocument();
//   });
// });





