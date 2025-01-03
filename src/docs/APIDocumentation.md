# API Documentation

## Overview
This document provides an overview of the API endpoints available in the Music Editor Web Application. Each endpoint is described with its purpose, request parameters, and response format.

## Endpoints

### 1. /api/tracks
- **Method:** GET
- **Description:** Retrieve a list of all tracks.
- **Response:**
  ```json
  [
    {
      "id": 1,
      "name": "Track 1",
      "volume": 75,
      "pan": 0
    },
    {
      "id": 2,
      "name": "Track 2",
      "volume": 50,
      "pan": -10
    }
  ]
  ```

### 2. /api/tracks/:id
- **Method:** GET
- **Description:** Retrieve details of a specific track by ID.
- **Parameters:**
  - `id` (number): The ID of the track.
- **Response:**
  ```json
  {
    "id": 1,
    "name": "Track 1",
    "volume": 75,
    "pan": 0
  }
  ```

### 3. /api/tracks
- **Method:** POST
- **Description:** Create a new track.
- **Request Body:**
  ```json
  {
    "name": "New Track",
    "volume": 50,
    "pan": 0
  }
  ```
- **Response:**
  ```json
  {
    "id": 3,
    "name": "New Track",
    "volume": 50,
    "pan": 0
  }
  ```

### 4. /api/tracks/:id
- **Method:** PUT
- **Description:** Update an existing track by ID.
- **Parameters:**
  - `id` (number): The ID of the track.
- **Request Body:**
  ```json
  {
    "name": "Updated Track",
    "volume": 60,
    "pan": 10
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "name": "Updated Track",
    "volume": 60,
    "pan": 10
  }
  ```

### 5. /api/tracks/:id
- **Method:** DELETE
- **Description:** Delete a track by ID.
- **Parameters:**
  - `id` (number): The ID of the track.
- **Response:**
  ```json
  {
    "message": "Track deleted successfully"
  }
  ```

## TypeScript Types

### Track
```typescript
type Track = {
  id: number;
  name: string;
  volume: number;
  pan: number;
};
```

### API Responses
```typescript
type GetTracksResponse = Track[];

type GetTrackResponse = Track;

type CreateTrackRequest = {
  name: string;
  volume: number;
  pan: number;
};

type CreateTrackResponse = Track;

type UpdateTrackRequest = {
  name: string;
  volume: number;
  pan: number;
};

type UpdateTrackResponse = Track;

type DeleteTrackResponse = {
  message: string;
};
```
