import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const emptyReward = () => ({ title: '', description: '', pledgeAmount: '' });

const CreateCampaignPage = () => {
  const [formData, setFormData] = useState({
    title: '', story: '', goalAmount: '', endDate: '', imageUrl: '',
    rewards: [emptyReward()],
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const updateField = (name, value) => setFormData((current) => ({ ...current, [name]: value }));

  const uploadFileHandler = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append('image', file);
    setUploading(true);
    try {
      const { data } = await axios.post('/api/upload', body, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateField('imageUrl', data.imageUrl);
      toast.success('Campaign cover uploaded.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const updateReward = (index, name, value) => {
    setFormData((current) => ({
      ...current,
      rewards: current.rewards.map((reward, i) => i === index ? { ...reward, [name]: value } : reward),
    }));
  };

  const addReward = () => setFormData((current) => ({ ...current, rewards: [...current.rewards, emptyReward()] }));
  const removeReward = (index) => setFormData((current) => ({ ...current, rewards: current.rewards.filter((_, i) => i !== index) }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imageUrl) return toast.error('Add a campaign cover before publishing.');
    if (!formData.rewards.length) return toast.error('Add at least one reward tier.');

    setLoading(true);
    try {
      await axios.post('/api/campaigns', {
        ...formData,
        goalAmount: Number(formData.goalAmount),
        rewards: formData.rewards.map((reward) => ({ ...reward, pledgeAmount: Number(reward.pledgeAmount) })),
      });
      toast.success('Your campaign is live.');
      navigate('/my-campaigns', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not publish campaign.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#f5f7f4]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-600">Creator studio</p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.03em] text-slate-950 sm:text-5xl">Give your idea a stage.</h1>
            <p className="mt-3 max-w-2xl text-slate-500">Shape the story, set the goal, and give supporters a reason to join you.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Draft</p>
            <p className="mt-1 text-sm font-bold text-slate-700">{formData.title || 'Untitled campaign'}</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.45fr_0.7fr]">
          <div className="space-y-6">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-7 flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-emerald-300">01</div>
                <div><p className="font-black text-slate-950">The idea</p><p className="text-sm text-slate-400">Tell people what you are building.</p></div>
              </div>

              <label className="block">
                <span className="text-sm font-bold text-slate-700">Campaign title</span>
                <input value={formData.title} onChange={(e) => updateField('title', e.target.value)} required placeholder="A name people will remember"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10" />
              </label>

              <label className="mt-5 block">
                <span className="flex justify-between text-sm font-bold text-slate-700"><span>Your story</span><span className="font-medium text-slate-400">{formData.story.length}/2000</span></span>
                <textarea value={formData.story} onChange={(e) => updateField('story', e.target.value.slice(0, 2000))} required rows={8} placeholder="Why does this idea matter? What will support make possible?"
                  className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10" />
              </label>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-7 flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-emerald-300">02</div>
                <div><p className="font-black text-slate-950">Campaign cover</p><p className="text-sm text-slate-400">Make the first impression count.</p></div>
              </div>

              <label className="group relative block cursor-pointer overflow-hidden rounded-[1.5rem] border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-emerald-400 hover:bg-emerald-50/30">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Campaign preview" className="h-72 w-full object-cover" />
                ) : (
                  <div className="flex h-72 flex-col items-center justify-center px-6 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-950 text-2xl text-emerald-300">↥</div>
                    <p className="mt-5 font-black text-slate-800">Drop your campaign into the spotlight</p>
                    <p className="mt-2 text-sm text-slate-400">PNG, JPG or WEBP · click to choose an image</p>
                  </div>
                )}
                <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={uploadFileHandler} />
                {uploading && <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 text-sm font-black text-white">Uploading cover...</div>}
                {formData.imageUrl && !uploading && <span className="absolute bottom-4 right-4 rounded-xl bg-slate-950/80 px-4 py-2 text-xs font-black text-white backdrop-blur">Change cover</span>}
              </label>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-7 flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-emerald-300">03</div>
                <div><p className="font-black text-slate-950">Rewards</p><p className="text-sm text-slate-400">Give supporters something meaningful.</p></div>
              </div>

              <div className="space-y-4">
                {formData.rewards.map((reward, index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="font-black text-slate-800">Reward {String(index + 1).padStart(2, '0')}</p>
                      {formData.rewards.length > 1 && <button type="button" onClick={() => removeReward(index)} className="text-xs font-black text-rose-500 hover:text-rose-600">Remove</button>}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input value={reward.title} onChange={(e) => updateReward(index, 'title', e.target.value)} required placeholder="Reward title" className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" />
                      <input type="number" min="1" value={reward.pledgeAmount} onChange={(e) => updateReward(index, 'pledgeAmount', e.target.value)} required placeholder="Pledge amount ($)" className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" />
                    </div>
                    <input value={reward.description} onChange={(e) => updateReward(index, 'description', e.target.value)} required placeholder="What does the supporter receive?" className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" />
                  </div>
                ))}
              </div>
              <button type="button" onClick={addReward} className="mt-4 rounded-xl border border-dashed border-emerald-300 px-4 py-3 text-sm font-black text-emerald-700 hover:bg-emerald-50">+ Add reward tier</button>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 shadow-xl shadow-slate-900/10">
              <div className="p-6 sm:p-7">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">04 · Launch settings</p>
                <h2 className="mt-2 text-2xl font-black text-white">Set the destination.</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">Choose how much you need and when the campaign closes.</p>

                <label className="mt-7 block"><span className="text-sm font-bold text-slate-200">Funding goal</span>
                  <div className="mt-2 flex overflow-hidden rounded-2xl border border-white/10 bg-white/5"><span className="flex items-center px-4 text-emerald-300 font-black">$</span><input type="number" min="1" value={formData.goalAmount} onChange={(e) => updateField('goalAmount', e.target.value)} required placeholder="10000" className="w-full bg-transparent px-2 py-3.5 text-white outline-none placeholder:text-slate-600" /></div>
                </label>

                <label className="mt-5 block"><span className="text-sm font-bold text-slate-200">Campaign end date</span>
                  <input type="date" value={formData.endDate} onChange={(e) => updateField('endDate', e.target.value)} required className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none focus:border-emerald-400" />
                </label>

                <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center justify-between text-sm"><span className="text-slate-400">Reward tiers</span><span className="font-black text-white">{formData.rewards.length}</span></div>
                  <div className="mt-3 flex items-center justify-between text-sm"><span className="text-slate-400">Cover</span><span className={formData.imageUrl ? 'font-black text-emerald-300' : 'font-bold text-amber-300'}>{formData.imageUrl ? 'Ready' : 'Missing'}</span></div>
                </div>

                <button type="submit" disabled={loading || uploading} className="group mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-300 py-4 font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50">
                  {loading ? 'Publishing...' : <>Publish campaign <span className="transition group-hover:translate-x-1">→</span></>}
                </button>
                <p className="mt-4 text-center text-xs leading-5 text-slate-500">You can edit your campaign later from your creator dashboard.</p>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaignPage;
