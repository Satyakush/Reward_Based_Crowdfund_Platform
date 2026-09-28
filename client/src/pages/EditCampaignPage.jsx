import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const emptyReward = () => ({ title: '', description: '', pledgeAmount: '' });

const EditCampaignPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', story: '', goalAmount: '', endDate: '', imageUrl: '', rewards: [emptyReward()] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(`/api/campaigns/${id}`);
        setFormData({
          title: data.title || '',
          story: data.story || '',
          goalAmount: data.goalAmount || '',
          endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
          imageUrl: data.imageUrl || '',
          rewards: data.rewards?.length ? data.rewards.map(({ title, description, pledgeAmount }) => ({ title, description, pledgeAmount })) : [emptyReward()],
        });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load campaign.');
        navigate('/my-campaigns');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const update = (name, value) => setFormData((current) => ({ ...current, [name]: value }));

  const updateReward = (index, name, value) => setFormData((current) => ({
    ...current,
    rewards: current.rewards.map((reward, i) => i === index ? { ...reward, [name]: value } : reward),
  }));

  const uploadFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append('image', file);
    setUploading(true);
    try {
      const { data } = await axios.post('/api/upload', body, { headers: { 'Content-Type': 'multipart/form-data' } });
      update('imageUrl', data.imageUrl);
      toast.success('Campaign cover updated.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await axios.put(`/api/campaigns/${id}`, {
        ...formData,
        goalAmount: Number(formData.goalAmount),
        rewards: formData.rewards.map((reward) => ({ ...reward, pledgeAmount: Number(reward.pledgeAmount) })),
      });
      toast.success('Campaign updated successfully.');
      navigate('/my-campaigns');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update campaign.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-[calc(100vh-72px)] bg-slate-50 p-10 text-center font-bold text-slate-500">Loading campaign editor...</div>;

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-5xl">
        <button type="button" onClick={() => navigate(-1)} className="text-sm font-bold text-slate-500 hover:text-emerald-600">← Back</button>
        <div className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-black uppercase tracking-[.16em] text-emerald-600">Creator studio</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Edit your campaign</h1>

          <form onSubmit={submit} className="mt-8 space-y-6">
            <label className="block"><span className="text-sm font-bold text-slate-700">Campaign title</span><input required value={formData.title} onChange={e => update('title', e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-emerald-500 focus:bg-white" /></label>
            <label className="block"><span className="text-sm font-bold text-slate-700">Story</span><textarea required rows={8} value={formData.story} onChange={e => update('story', e.target.value)} className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 leading-7 outline-none focus:border-emerald-500 focus:bg-white" /></label>

            <div>
              <span className="text-sm font-bold text-slate-700">Campaign cover</span>
              <label className="mt-2 block cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50">
                {formData.imageUrl ? <img src={formData.imageUrl} alt="Campaign cover" className="h-72 w-full object-cover" /> : <div className="flex h-56 items-center justify-center font-bold text-slate-400">Choose an image</div>}
                <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={uploadFile} />
              </label>
              {uploading && <p className="mt-2 text-sm font-bold text-emerald-600">Uploading...</p>}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label><span className="text-sm font-bold text-slate-700">Funding goal</span><input type="number" min="1" required value={formData.goalAmount} onChange={e => update('goalAmount', e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-emerald-500" /></label>
              <label><span className="text-sm font-bold text-slate-700">End date</span><input type="date" required value={formData.endDate} onChange={e => update('endDate', e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-emerald-500" /></label>
            </div>

            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between"><div><h2 className="font-black text-slate-900">Reward tiers</h2><p className="text-sm text-slate-500">Keep at least one valid reward.</p></div><button type="button" onClick={() => setFormData(c => ({ ...c, rewards: [...c.rewards, emptyReward()] }))} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white">+ Add tier</button></div>
              <div className="mt-4 space-y-4">{formData.rewards.map((reward, index) => <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex justify-between"><p className="font-black">Reward {index + 1}</p>{formData.rewards.length > 1 && <button type="button" onClick={() => setFormData(c => ({ ...c, rewards: c.rewards.filter((_, i) => i !== index) }))} className="text-sm font-bold text-rose-500">Remove</button>}</div><div className="mt-3 grid gap-3 sm:grid-cols-2"><input required placeholder="Reward title" value={reward.title} onChange={e => updateReward(index, 'title', e.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" /><input required type="number" min="1" placeholder="Pledge amount (₹)" value={reward.pledgeAmount} onChange={e => updateReward(index, 'pledgeAmount', e.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" /></div><input required placeholder="Reward description" value={reward.description} onChange={e => updateReward(index, 'description', e.target.value)} className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" /></div>)}</div>
            </section>

            <button disabled={saving || uploading} className="w-full rounded-2xl bg-slate-950 py-4 font-black text-white hover:bg-emerald-600 disabled:opacity-50">{saving ? 'Saving changes...' : 'Save campaign changes'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCampaignPage;
