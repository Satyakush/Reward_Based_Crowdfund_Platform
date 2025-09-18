// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import CampaignCard from '../components/CampaignCard';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // <-- IMPORT

const HomePage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // ... fetch logic is the same ...
    const fetchCampaigns = async () => {
      try {
        const { data } = await axios.get('/api/campaigns');
        setCampaigns(data);
      } catch (err) {
        setError('Could not fetch campaigns.');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  // Animation container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // This will make each card animate one after the other
      },
    },
  };

  if (loading) return <div className="p-8 text-center">Loading campaigns...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div>
      {/* --- NEW HERO SECTION --- */}
      <div className="bg-gray-800 text-white">
        <div className="container mx-auto px-8 py-20 text-center">
          <motion.h1 
            className="text-4xl font-bold md:text-6xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Fund the Future.
          </motion.h1>
          <motion.p 
            className="mt-4 text-lg text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Support the most innovative projects and bring new ideas to life.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link to="/create-campaign" className="mt-8 inline-block rounded-md bg-green-500 px-8 py-4 font-semibold text-white hover:bg-green-600">
              Start a Campaign
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Campaigns Grid Section */}
      <div className="container mx-auto p-4 md:p-8">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">Explore Campaigns</h2>
        {campaigns.length === 0 ? (
          <p className="text-center">No campaigns found.</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HomePage;