import pytest
import sys
import os

# Add the parent directory (backend) to the Python path
# This allows 'from app import app' to work
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app # Import the Flask app instance

@pytest.fixture
def client():
    """Create a test client for the Flask app."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_get_homework_list_initial(client):
    """Test fetching the initial list of homework assignments."""
    response = client.get('/api/homework')
    assert response.status_code == 200
    json_data = response.get_json()
    assert isinstance(json_data, list)
    # Check if the initial two items are present (can be more specific if needed)
    assert len(json_data) >= 2
    titles = [item['title'] for item in json_data]
    assert "Math Homework" in titles
    assert "History Essay" in titles

def test_add_homework(client):
    """Test adding a new homework assignment."""
    new_hw_data = {
        "title": "Science Project",
        "subject": "Science",
        "dueDate": "2024-04-01"
    }
    response = client.post('/api/homework', json=new_hw_data)
    assert response.status_code == 201 # Created
    json_data = response.get_json()
    assert json_data['title'] == new_hw_data['title']
    assert 'id' in json_data

    # Verify it's in the list now
    response_get = client.get('/api/homework')
    assert response_get.status_code == 200
    all_homework = response_get.get_json()
    assert any(hw['title'] == "Science Project" for hw in all_homework)

def test_update_homework(client):
    """Test updating an existing homework assignment (marking as complete)."""
    # First, add a homework to ensure one exists with a known ID, or get an existing one
    # For simplicity, let's assume the first initial homework (id=1) exists
    homework_id_to_update = 1

    # Check current status (optional, but good for confirming the test's premise)
    response_get_before = client.get(f'/api/homework')
    hw_list_before = response_get_before.get_json()
    hw_before = next((hw for hw in hw_list_before if hw['id'] == homework_id_to_update), None)
    assert hw_before is not None, f"Homework with ID {homework_id_to_update} not found for update test."

    update_data = {"completed": not hw_before['completed']} # Toggle completion
    response = client.put(f'/api/homework/{homework_id_to_update}', json=update_data)
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data['id'] == homework_id_to_update
    assert json_data['completed'] == update_data['completed']

    # Verify the update in the main list
    response_get_after = client.get('/api/homework')
    hw_list_after = response_get_after.get_json()
    hw_after = next((hw for hw in hw_list_after if hw['id'] == homework_id_to_update), None)
    assert hw_after is not None
    assert hw_after['completed'] == update_data['completed']


def test_delete_homework(client):
    """Test deleting a homework assignment."""
    # Add a new one to delete it, ensuring test independence
    new_hw_data = {
        "title": "To Be Deleted",
        "subject": "Temporary",
        "dueDate": "2024-01-01"
    }
    response_post = client.post('/api/homework', json=new_hw_data)
    assert response_post.status_code == 201
    homework_id_to_delete = response_post.get_json()['id']

    response_delete = client.delete(f'/api/homework/{homework_id_to_delete}')
    assert response_delete.status_code == 200
    assert response_delete.get_json()['message'] == "Homework deleted successfully"

    # Verify it's no longer in the list
    response_get = client.get('/api/homework')
    all_homework = response_get.get_json()
    assert not any(hw['id'] == homework_id_to_delete for hw in all_homework)

def test_add_homework_missing_fields(client):
    """Test adding homework with missing fields."""
    response = client.post('/api/homework', json={"title": "Only Title"})
    assert response.status_code == 400 # Bad Request
    json_data = response.get_json()
    assert "error" in json_data
    assert "Missing data" in json_data['error']

def test_update_nonexistent_homework(client):
    """Test updating a homework assignment that does not exist."""
    response = client.put('/api/homework/9999', json={"completed": True}) # Assuming ID 9999 does not exist
    assert response.status_code == 404 # Not Found
    json_data = response.get_json()
    assert "error" in json_data
    assert "Homework not found" in json_data['error']

def test_delete_nonexistent_homework(client):
    """Test deleting a homework assignment that does not exist."""
    response = client.delete('/api/homework/9999') # Assuming ID 9999 does not exist
    assert response.status_code == 404 # Not Found
    json_data = response.get_json()
    assert "error" in json_data
    assert "Homework not found" in json_data['error']
