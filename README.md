# CRUD for Node and MongoDB

Here is a demo to build a simple CRUD with Node, Express, and MongoDB. Using to-do list as example for the demo which is provide add, update, delete and query. 

## Endpoints

### Add (import) Data

**Request**

`POST /todolist/`

```
{
	"name": "task1",
	"description": "task desc",
	"priority": "top",
	"due_time": 1597235700,
	"is_done": false
}
```

Parameters (required):
- `name` of to-do task. String.
- `priority` of to-do task. String.
- `due_time` of to-do task. Unix timestamp (epoch) in milliseconds.

**Response**

```
{
    "data": {
        "name": "task1",
        "description": "task desc",
        "priority": "top",
        "due_time": "1970-01-19T11:40:35.700Z",
        "is_done": false,
        "create_time": 1597130960440,
        "_id": "5f3248d0a94a6b5e0451e28b"
    }
}
```

### Search / Get Data


**Request**

`GET /todolist/?name={name}&since={since}&until={until}&limit={limit}`

Parameters (required):
- `name` of to-do task. String.

Parameters (optional):
- `limit` max number of items returned.. String.
- `since` data created since and after (inclusive). Unix timestamp (epoch) in milliseconds.
- `until` data created before (exclusive). Unix timestamp (epoch) in milliseconds.

**Response**

```
{
    "data": [
        {
            "_id": "5f3248d0a94a6b5e0451e28b",
            "name": "task1",
            "description": "task desc",
            "priority": "top",
            "due_time": "1970-01-19T11:40:35.700Z",
            "is_done": false,
            "create_time": 1597130960440
        }
    ]
}
```

### Update Data

**Request**

`PATCH /todolist/{id}`

```
{
	"name": "task1",
	"description": "update task desc",
	"priority": "top",
	"due_time": 1597235700,
	"is_done": true
}
```
Parameters (required):
- `id` of to-do task. String.

**Response**

```
{
    "data": {
        "_id": "5f3248d0a94a6b5e0451e28b",
        "name": "task1",
        "description": "update task desc",
        "priority": "top",
        "due_time": "1970-01-19T11:40:35.700Z",
        "is_done": true,
        "create_time": "2020-08-11T07:29:20.440Z",
        "update_time": "2020-08-11T07:46:09.057Z"
    }
}
```

### Delete Data

**Request**

`DELETE /todolist/{id}`

Parameters (required):
- `id` of to-do task. String.

**Response**

```
{
    "data": {
        "id": "5f3248d0a94a6b5e0451e28b"
    }
}
```

## Requirements
- NodeJs
- mongodb
- Express

## Install & Run
```
git clone https://github.com/brian90191/nodejs-mongo-crud-demo.git
cd nodejs-mongo-crud-demo
npm install
npm start
```

## Test
```
npm test
```
