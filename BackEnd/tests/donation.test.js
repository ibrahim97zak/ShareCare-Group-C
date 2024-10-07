import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createDonationOffer } from '../controllers/donationController';
import DonationOffer from '../models/DonationOffer';
import Donor from '../models/Donor';
import { createInAppNotification } from '../controllers/notificationController';

jest.mock('../controllers/notificationController', () => ({
  createInAppNotification: jest.fn().mockResolvedValue({ message: 'Notification created' }),
}));

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Donation Controller - createDonationOffer', () => {
  beforeEach(async () => {
    await Donor.deleteMany({});
    await DonationOffer.deleteMany({});
  });

  const createValidDonor = async (overrides = {}) => {
    const donorData = {
      name: 'John Doe',
      userName: 'johndoe',
      email: 'john@example.com',
      password: 'password123',
      phone: '1234567890',
      gender: 'Male',
      role: 'Donor',
      offers: [],
      ...overrides
    };
    return await Donor.create(donorData);
  };

  it('should create a new donation offer with valid data', async () => {
    const donor = await createValidDonor();

    const req = {
      body: {
        donorId: donor._id.toString(),
        donationType: 'Clothes',
        quantity: 10,
        location: 'Hebron, Palestine'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await createDonationOffer(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Donation offer created',
        savedOffer: expect.objectContaining({
          donationType: 'Clothes',
          quantity: 10,
          location: 'Hebron, Palestine'
        }),
        donorName: 'John Doe'
      })
    );

    const updatedDonor = await Donor.findById(donor._id);
    expect(updatedDonor.offers.length).toBe(1);
  });

  it('should return an error for invalid donor ID', async () => {
    const req = {
      body: {
        donorId: 'invalid123',
        donationType: 'Food',
        quantity: 50,
        location: 'Jerusalem'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await createDonationOffer(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Donor not found' });
  });

  it('should return an error when donation type is missing', async () => {
    const donor = await createValidDonor();

    const req = {
      body: {
        donorId: donor._id.toString(),
        quantity: 25,
        location: 'Ramallah'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await createDonationOffer(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should return an error for invalid quantity', async () => {
    const donor = await createValidDonor();

    const req = {
      body: {
        donorId: donor._id.toString(),
        donationType: 'Books',
        quantity: -5,
        location: 'Bethlehem'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await createDonationOffer(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should return an error when location is missing', async () => {
    const donor = await createValidDonor();

    const req = {
      body: {
        donorId: donor._id.toString(),
        donationType: 'Money',
        quantity: 100
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await createDonationOffer(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should create donation offers with different valid donation types', async () => {
    const donor = await createValidDonor();

    const donationTypes = ['Clothes', 'Food', 'Money', 'Medicines', 'Books', 'Furniture', 'Other'];

    for (const donationType of donationTypes) {
      const req = {
        body: {
          donorId: donor._id.toString(),
          donationType,
          quantity: 10,
          location: 'Various Cities, Palestine'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await createDonationOffer(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Donation offer created',
          savedOffer: expect.objectContaining({
            donationType,
            quantity: 10,
            location: 'Various Cities, Palestine'
          }),
          donorName: 'John Doe'
        })
      );
    }

    const updatedDonor = await Donor.findById(donor._id);
    expect(updatedDonor.offers.length).toBe(donationTypes.length);
  });
});