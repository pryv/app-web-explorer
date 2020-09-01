# Pryv-Web-Explorer

There are 2 events map in the store. Both events map will be loaded at the time of login. 

  - events_map - <apiEndpoint, eventList> 
    -  All the events will be loaded at the time of login as a background process.
  - display_events_map - <apiEndpoint, eventsList> 
    - Default no of events will be loaded initailly at the time of login (20 events)

display_events_map will be always feeded using events_map according to the limit filter.

## Searched Usecases
  - When there are no filters selected default display map will be displayed. But when the user set a limit as a filter. 
     - if the limit is higher than 20 - Then display map will be loaded using events_map. 
```this.eventsDisplayMap[apiEndpoint] = events.slice(0, limit);```
    - if the limit is less than 20 - Then display map will be slices using the selected limit. 
```this.eventsDisplayMap[apiEndpoint] = events.slice(0, limit);```

    Then another new array selectedEvents = [] , will be feeded using display_events_map after filtering selected_streams(checkboxes appear in left) and selected filters. SelectedEvents Map will be showed to the user at the end. selectedEvents array will be created each time when user select or unselect a stream or a filter.
    
## Modified Usecases
  - Stream Deletion
    - When a trahsed stream is deleted, events_map, display_events_map and stream_map will be loaded again using API call.(Simillar to login)   - LoadStreamsForConnectionBtn.vue
  - Event Creation
    -  When a new event is created, it will be added to both events_map and display_events_map using events.CREATE api response. 
  - Event Modification
    - When an event is modified, exisitng event object of both events_map and display_event_map will be updated.     
- Each time event_display map is updated displayEvents method in the events.vue component will be called and recreates a selectedEvents [] array populate it.

## Load Buttons
- Load Events
    - Events will be loaded using modified since date and will be added to both events_display_map and events_map    
- Load All 
    - Both events and streams will be loaded using modified since date and data will be added to respctive maps. 
