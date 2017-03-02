const ActionTypes = {
  // Initiate a request to the WP API
  RequestCreatePost: 'kasia/REQUEST_CREATE_POST',
  RequestCreateQuery: 'kasia/REQUEST_CREATE_QUERY',
  // Place record of a request in the store
  RequestAcknowledge: 'kasia/REQUEST_ACKNOWLEDGE',
  // Record the result of a request on the store
  RequestComplete: 'kasia/REQUEST_COMPLETE',
  // Record the failure of a request on the store
  RequestFail: 'kasia/REQUEST_FAILED'
}

export default ActionTypes
