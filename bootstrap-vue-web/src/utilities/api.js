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

const createEventApi = [
  {
    method: "events.create",
    params: {},
  },
];
export default {
  ACCESS_INFO_API: accessInfoApi,
  ACCESS_EVENTS_API: getEventsApi,
  GET_STREAMS_API: getStreamsApi,
  CREATE_EVENT_API: createEventApi,
};
