const accessInfoApi = [
  {
    method: "getAccessInfo",
    params: {},
  },
];
const getEventsApi = [
  {
    method: "events.get",
    params: {},
  },
];
const getStreamsApi = [
  {
    method: "streams.get",
    params: {},
  },
];

const createStreamsApi = [
  {
    method: "streams.create",
    params: {},
  },
];

const createEventApi = [
  {
    method: "events.create",
    params: {},
  },
];

const updateStreamApi = [
  {
    method: "streams.update",
    params: {},
  },
];

const updateEventApi = [
  {
    method: "events.update",
    params: {},
  },
];

const deleteStreamApi = [
  {
    method: "streams.delete",
    params: {},
  },
];

export default {
  ACCESS_INFO_API: accessInfoApi,
  ACCESS_EVENTS_API: getEventsApi,
  GET_STREAMS_API: getStreamsApi,
  CREATE_EVENT_API: createEventApi,
  UPDATE_STREAM_API: updateStreamApi,
  DELETE_STREAM_API: deleteStreamApi,
  UPDATE_EVENT_API: updateEventApi,
  CREATE_STREAM_API: createStreamsApi,
};
