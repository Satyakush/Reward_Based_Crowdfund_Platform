import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const getDaysLeft = (date) => {
  if (!date) return null;
  const diff = new Date(date).getTime() - Date.now();
  return diff <= 0 ? 0 : Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const CampaignCard = ({ campaign }) => {
  const percentage = campaign.goalAmount > 0 ? Math.min(100, Math.round((campaign.amountRaised / campaign.goalAmount) * 100)) : 0;
  const daysLeft = getDaysLeft(campaign.endDate);
  const isFunded = percentage >= 100;
  const isEnded = daysLeft === 0;
  const statusClass = isFunded ? 'bg-emerald-400 text-slate-950' : isEnded ? 'bg-white/85 text-slate-700' : 'bg-slate-950/75 text-white';

  return <motion.div variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }} className="h-full">
    <Link to={'/campaign/' + campaign._id} className="block h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-2xl hover:shadow-slate-900/10">
        <div className="relative overflow-hidden"><img src={campaign.imageUrl} alt={campaign.title} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" /><div className="absolute left-4 top-4"><span className={'rounded-full px-3 py-1.5 text-[11px] font-black backdrop-blur ' + statusClass}>{isFunded ? 'Funded' : isEnded ? 'Ended' : 'Active'}</span></div>{daysLeft !== null && !isEnded && <div className="absolute bottom-4 right-4 rounded-full border border-white/20 bg-slate-950/70 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur">{daysLeft} days left</div>}</div>
        <div className="flex flex-1 flex-col p-5"><h3 className="line-clamp-2 text-xl font-black leading-tight tracking-tight text-slate-900 group-hover:text-emerald-700">{campaign.title}</h3><p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-500">{campaign.story}</p>
          <div className="mt-auto pt-6"><div className="flex items-end justify-between"><div><p className="text-2xl font-black text-slate-900">${Number(campaign.amountRaised || 0).toLocaleString()}</p><p className="text-xs font-medium text-slate-400">raised of ${Number(campaign.goalAmount || 0).toLocaleString()}</p></div><span className="text-sm font-black text-emerald-600">{percentage}%</span></div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><motion.div initial={{ width: 0 }} whileInView={{ width: percentage + '%' }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" /></div>
          <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-400"><span>{campaign.rewards?.length || 0} reward tiers</span><span className="text-slate-900 group-hover:text-emerald-600">View campaign →</span></div></div>
        </div>
      </article>
    </Link>
  </motion.div>;
};

export default CampaignCard;