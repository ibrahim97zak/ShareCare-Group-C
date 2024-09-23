import Request, { find, findById } from '../models/DonationRequest.js';
import { find as _find } from '../models/User.js';
import { create } from '../models/Notification.js';

export async function createRequest(req, res) {
  try {
    const { donationType, quantity, location, description } = req.body;
    const newRequest = new Request({
      beneficiary: req.user.id,
      donationType,
      quantity,
      location,
      description
    });

    await newRequest.save();

    // Notify potential donors
    const donors = await _find({ userType: 'donor' });
    for (let donor of donors) {
      await create({
        userId: donor._id,
        type: 'request_match',
        content: `A new ${donationType} request is available in ${location}`,
        relatedId: newRequest._id,
        onModel: 'Request'
      });
    }

    res.status(201).json(newRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

export async function getRequests(req, res) {
  try {
    const requests = await find().populate('beneficiary', 'name');
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

export async function getRequestById(req, res) {
  try {
    const request = await findById(req.params.id).populate('beneficiary', 'name');
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(request);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(500).send('Server error');
  }
}

export async function updateRequest(req, res) {
  try {
    const { donationType, quantity, location, status, description } = req.body;
    let request = await findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.beneficiary.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    request.donationType = donationType || request.donationType;
    request.quantity = quantity || request.quantity;
    request.location = location || request.location;
    request.status = status || request.status;
    request.description = description || request.description;
    request.updatedAt = Date.now();

    await request.save();
    res.json(request);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(500).send('Server error');
  }
}

export async function deleteRequest(req, res) {
  try {
    const request = await findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.beneficiary.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await request.remove();
    res.json({ message: 'Request removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(500).send('Server error');
  }
}

export async function getRequestsByBeneficiary(req, res) {
  try {
    const requests = await find({ beneficiary: req.user.id }).populate('beneficiary', 'name');
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

export async function getOpenRequests(req, res) {
  try {
    const openRequests = await find({ status: 'open' }).populate('beneficiary', 'name');
    res.json(openRequests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}