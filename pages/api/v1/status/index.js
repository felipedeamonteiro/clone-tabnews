function status(req, res) {
  res.status(200).send({ message: 'API is working' });
}

export default status;
