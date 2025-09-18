// src/components/CampaignCard.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CampaignCard = ({ campaign }) => {
  const percentageRaised = (campaign.goalAmount > 0) ? (campaign.amountRaised / campaign.goalAmount) * 100 : 0;
  const cardVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={cardVariants} className="h-full">
      <Link to={`/campaign/${campaign._id}`} className="block h-full">
        <div className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 ease-in-out hover:shadow-xl">
          <img src={campaign.imageUrl} alt={campaign.title} className="h-48 w-full object-cover" />
          <div className="flex flex-1 flex-col p-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold leading-tight text-gray-900">{campaign.title}</h3>
              <p className="mt-2 h-16 overflow-hidden text-sm text-gray-700">{campaign.story}</p>
            </div>
            <div className="mt-4">
              <div className="h-1 w-full rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{ width: `${percentageRaised > 100 ? 100 : percentageRaised}%` }}
                ></div>
              </div>
              <div className="mt-2">
                <p className="font-bold text-green-600">${campaign.amountRaised.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{Math.round(percentageRaised)}% funded</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CampaignCard;