function status(request, response) {
  response.status(200).json({status: "API is running"});
}

export default status;
