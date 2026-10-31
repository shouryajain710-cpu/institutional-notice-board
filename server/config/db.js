const mongoose = require('mongoose');
const User = require('../models/User');
const Notice = require('../models/Notice');
const Event = require('../models/Event');

let mongoMemoryServerInstance = null;

const seedDefaultData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial demo users...');

      const admin = await User.create({
        name: 'Dr. Arthur Vance (Dean/Admin)',
        email: 'admin@college.edu',
        password: 'Admin@123',
        role: 'admin',
        department: 'Institutional Administration'
      });

      const clubOrganizer = await User.create({
        name: 'Rohan Sharma (ACM Lead)',
        email: 'club@college.edu',
        password: 'Club@123',
        role: 'club_organizer',
        department: 'Computer Science & Engineering',
        clubName: 'ACM Student Chapter & Tech Society'
      });

      const student = await User.create({
        name: 'Priya Patel',
        email: 'student@college.edu',
        password: 'Student@123',
        role: 'student',
        department: 'Information Technology'
      });

      console.log('🌱 Seeding initial notices...');
      await Notice.create([
        {
          title: 'End Semester Examination Schedule - Autumn 2026',
          content:
            'The final timetable for the Autumn Semester 2026 examinations has been officially published. Examinations will commence from 15th October 2026. Hall tickets and seating arrangements will be available for download on the student portal starting 1st October. Students with fee dues must clear them before hall ticket generation.',
          category: 'Examination',
          priority: 'urgent',
          isPinned: true,
          targetAudience: 'All',
          department: 'Examination Cell',
          referenceNumber: 'EXAM/2026/089',
          postedBy: admin._id,
          postedByName: admin.name,
          postedByRole: 'admin',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        {
          title: 'Gandhi Jayanti & Dussehra Holiday Announcement',
          content:
            'The institution will observe national holidays on 2nd October 2026 (Gandhi Jayanti) and 12th-13th October 2026 (Dussehra festivities). Administrative offices and academic departments will remain closed. Campus hostel messes will operate under festive timings.',
          category: 'Holiday',
          priority: 'normal',
          isPinned: true,
          targetAudience: 'All',
          department: 'Registrar Office',
          referenceNumber: 'REG/CIR/2026/104',
          postedBy: admin._id,
          postedByName: admin.name,
          postedByRole: 'admin',
          expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)
        },
        {
          title: 'Campus Placement Drive: Top Tech Innovators 2026-27',
          content:
            'Registration is now open for the upcoming Tier-1 campus placement drive for B.Tech, M.Tech, and MCA final year students. Participating companies include Google, Microsoft, and Oracle. Ensure your updated resume and aggregate CGPA proof are submitted on the T&P portal by 28th September.',
          category: 'Placement',
          priority: 'high',
          isPinned: false,
          targetAudience: 'Final Year',
          department: 'Training & Placement Cell',
          referenceNumber: 'TNP/2026/045',
          postedBy: admin._id,
          postedByName: admin.name,
          postedByRole: 'admin',
          expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
        },
        {
          title: 'Annual Inter-College Sports Meet - VIGOR 2026',
          content:
            'Trials and selections for Football, Cricket, Basketball, Badminton, and Track & Field events will be conducted at the University Sports Complex from September 26 to September 28, 2026. Interested students must report to the Physical Education Director with student ID cards.',
          category: 'Sports',
          priority: 'normal',
          isPinned: false,
          targetAudience: 'Students',
          department: 'Department of Physical Education',
          referenceNumber: 'SPO/2026/012',
          postedBy: admin._id,
          postedByName: admin.name,
          postedByRole: 'admin'
        },
        {
          title: 'Semester Tuition & Lab Fee Clearance Deadline',
          content:
            'All enrolled students are requested to clear their tuition, library, and laboratory fee dues for the current term on or before 30th September 2026. Late fees will be levied thereafter as per university norms.',
          category: 'Academic',
          priority: 'high',
          isPinned: false,
          targetAudience: 'Students',
          department: 'Finance & Accounts',
          referenceNumber: 'ACC/2026/033',
          postedBy: admin._id,
          postedByName: admin.name,
          postedByRole: 'admin'
        }
      ]);

      console.log('🌱 Seeding initial events...');
      await Event.create([
        {
          title: 'Hackathon 2026 - CodeCraft 36-Hour National Hack',
          description:
            'Join over 50 collegiate teams building cutting-edge AI, IoT, and Cloud solutions in our flagship 36-hour annual hackathon. Free meals, mentorship from industry architects, and cash prizes totaling $5,000!',
          category: 'Hackathon',
          date: new Date('2026-09-25T09:00:00.000Z'),
          time: '09:00 AM - Next Day 09:00 PM',
          venue: 'Seminar Hall & Innovation Lab',
          organizerClub: 'ACM Student Chapter',
          postedBy: clubOrganizer._id,
          postedByName: clubOrganizer.name,
          status: 'approved',
          registrationLink: 'https://hackathon2026.college.edu',
          capacity: 200,
          registeredCount: 142
        },
        {
          title: 'AI & Robotics Hands-on Workshop: Autonomous Systems',
          description:
            'An intensive workshop covering Robot Operating System 2 (ROS2), LiDAR-based SLAM navigation, and Computer Vision for autonomous mobile ground vehicles.',
          category: 'Workshop',
          date: new Date('2026-09-28T10:00:00.000Z'),
          time: '10:00 AM - 04:00 PM',
          venue: 'Robotics Lab, Ground Floor',
          organizerClub: 'Robotics Club',
          postedBy: clubOrganizer._id,
          postedByName: clubOrganizer.name,
          status: 'approved',
          registrationLink: 'https://workshops.college.edu/robotics',
          capacity: 60,
          registeredCount: 48
        },
        {
          title: 'Annual Cultural Fest - Tarang 2026',
          description:
            'The biggest institutional cultural festival of the year! Featuring 20+ competitive events including Battle of the Bands, Choreo Night, Dramatics, Street Play, and a live celebrity musical performance.',
          category: 'Cultural',
          date: new Date('2026-10-18T16:00:00.000Z'),
          time: '04:00 PM - 10:00 PM',
          venue: 'Main University Amphitheatre',
          organizerClub: 'Cultural Committee',
          postedBy: admin._id,
          postedByName: admin.name,
          status: 'approved',
          capacity: 1500,
          registeredCount: 780
        },
        {
          title: 'Web3 & Decentralized Identity Bootcamp (Club Proposal)',
          description:
            'A student-run exploratory workshop demystifying zero-knowledge cryptography, verifiable credentials, and decentralized applications for undergraduate engineers.',
          category: 'Technical',
          date: new Date('2026-10-05T14:00:00.000Z'),
          time: '02:00 PM - 05:00 PM',
          venue: 'Auditorium Hall B',
          organizerClub: 'Blockchain & Web3 Society',
          postedBy: clubOrganizer._id,
          postedByName: clubOrganizer.name,
          status: 'pending',
          capacity: 100,
          registeredCount: 0
        }
      ]);

      console.log('✅ Demo database seeded successfully!');
    }
  } catch (err) {
    console.error('Data seeding note/error:', err.message);
  }
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/institutional-notice-board';

  try {
    console.log(`📡 Connecting to MongoDB at: ${uri}`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    await seedDefaultData();
  } catch (err) {
    console.warn(`⚠️ Could not connect to external MongoDB: ${err.message}`);
    console.log('🔄 Initializing in-memory MongoDB fallback (mongodb-memory-server)...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServerInstance = await MongoMemoryServer.create();
      const memUri = mongoMemoryServerInstance.getUri();
      console.log(`📡 Connected to In-Memory MongoDB at: ${memUri}`);

      await mongoose.connect(memUri);
      console.log('✅ In-Memory MongoDB Connected & Ready');
      await seedDefaultData();
    } catch (memErr) {
      console.error('❌ Failed to start in-memory MongoDB:', memErr.message);
      throw memErr;
    }
  }
};

module.exports = connectDB;
