import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom'
import App from '../App';
import * as axios from "axios";

// Mock out all top level functions, such as get, put, delete and post:
jest.mock("axios");

// mock data to populate initial board
let data = [{"name":"Serendipity","status":"Docked"},{"name":"Imagination","status":"Outbound to Sea"},{"name":"Liberty","status":"Maintenance"},
            {"name":"Wanderlust","status":"Docked"},{"name":"Gale","status":"Outbound to Sea"},
            {"name":"Zephyr","status":"Inbound to Harbor"},{"name":"Sapphire","status":"Docked"},
            {"name":"Amazonite","status":"Outbound to Sea"},{"name":"Atlantis","status":"Maintenance"},
            {"name":"Leviathan","status":"Maintenance"},{"name":"Wayfarer","status":"Outbound to Sea"},
            {"name":"Neptune","status":"Inbound to Harbor"}];

// mock get request
axios.get.mockImplementation((url) => {
  return Promise.resolve({ data: data })
});

// mock post request
axios.post.mockImplementation((url) => {
    return Promise.resolve({ data: null })
  });

// basic test to check if things are running properly
test('should render the app and have a header', async () => {
  render(<App />);
  const linkElement = await waitFor(() => screen.getByText("Fishfry Tours"));
  expect(linkElement).toBeInTheDocument();
});

test('should render the board with 4 columns', async () => {
    render(<App />);
    const col1 = await waitFor(() => screen.getByText("Docked"));
    const col2 = await waitFor(() => screen.getByText("Outbound to Sea"));
    const col3 = await waitFor(() => screen.getByText("Inbound to Harbor"));
    const col4 = await waitFor(() => screen.getByText("Maintenance"));
    expect(col1).toBeInTheDocument();
    expect(col2).toBeInTheDocument();
    expect(col3).toBeInTheDocument();
    expect(col4).toBeInTheDocument();
});

test('should render the board with all boats', async () => {
    render(<App />);
    const col1 = await waitFor(() => screen.getByText("Serendipity"));
    const col2 = await waitFor(() => screen.getByText("Imagination"));
    const col3 = await waitFor(() => screen.getByText("Liberty"));
    const col4 = await waitFor(() => screen.getByText("Wanderlust"));
    const col5 = await waitFor(() => screen.getByText("Gale"));
    const col6 = await waitFor(() => screen.getByText("Zephyr"));
    const col7 = await waitFor(() => screen.getByText("Sapphire"));
    const col8 = await waitFor(() => screen.getByText("Amazonite"));
    const col9 = await waitFor(() => screen.getByText("Atlantis"));
    const col10 = await waitFor(() => screen.getByText("Leviathan"));
    const col11 = await waitFor(() => screen.getByText("Wayfarer"));
    const col12 = await waitFor(() => screen.getByText("Neptune"));

    expect(col1).toBeInTheDocument();
    expect(col2).toBeInTheDocument();
    expect(col3).toBeInTheDocument();
    expect(col4).toBeInTheDocument();
    expect(col4).toBeInTheDocument();
    expect(col5).toBeInTheDocument();
    expect(col6).toBeInTheDocument();
    expect(col7).toBeInTheDocument();
    expect(col8).toBeInTheDocument();
    expect(col9).toBeInTheDocument();
    expect(col10).toBeInTheDocument();
    expect(col11).toBeInTheDocument();
    expect(col12).toBeInTheDocument();
});

test('should render the add button', async () => {
    render(<App />);
    const col1 = await waitFor(() => screen.getByLabelText("add"));
    expect(col1).toBeInTheDocument();
})

test('should not render new boat modal initially', async () => {
    render(<App />);
    const col11 = await waitFor(() => screen.queryByText("Add new boat"));
    expect(col11).not.toBeInTheDocument();
})

test('should be able to type new boat name into the new boat dialog', async () => {
    const {container}=render(<App />);
    const addBtn = await waitFor(() => screen.getByLabelText("add"));
    fireEvent.click(addBtn);
    const col1 = await waitFor(() => screen.getByText("Add new boat"));
    
    const inputEl = await waitFor(() => screen.getByTestId("new-boat-input"));
    userEvent.type(inputEl, "Testboat");
    expect(screen.getByTestId("new-boat-input")).toHaveValue("Testboat");
})

test('should be able to add new boat into first column', async () => {
    const {container}=render(<App />);
    const addBtn = await waitFor(() => screen.getByLabelText("add"));
    fireEvent.click(addBtn);
    const col1 = await waitFor(() => screen.getByText("Add new boat"));
    
    const inputEl = await waitFor(() => screen.getByTestId("new-boat-input"));
    userEvent.type(inputEl, "Testboat");

    const addButton = await waitFor(() => screen.getByTestId("add-new-boat-button"));
    fireEvent.click(addButton);

    const col11 = await waitFor(() => screen.getByText("Testboat"));
    expect(col11).toBeInTheDocument();
})