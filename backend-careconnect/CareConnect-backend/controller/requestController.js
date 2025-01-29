import Request from "../model/requestModel.js"

export const addRequest = async (req, res) => {
    try {
      const { request, time, date } = req.body;
      const newRequest = new Request({ request, time, date });
      await newRequest.save();
      res.status(201).json({ message: 'Request saved successfully', newRequest });
    } catch (error) {
      res.status(500).json({ message: 'Error saving request', error });
    }
  };
  
  
  export const getRequest = async (req, res) => {
    try {
      const requests = await Request.find().sort({ _id: -1 }); // Fetch in descending order
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching requests', error });
    }
  };
  
  
  export const deleteRequest = async (req, res) => {
    try {
      const { id } = req.params;
      await Request.findByIdAndDelete(id);
      res.status(200).json({ message: 'Request deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting request', error });
    }
  };