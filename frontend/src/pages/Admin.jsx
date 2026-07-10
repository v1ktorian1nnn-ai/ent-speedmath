import React, { useEffect, useState } from "react";
import { useI18n } from "../i18n";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";

const emptyForm = { topic: "", difficulty: 1, statement: "", options: "", correctIndex: 0, image: null };

export default function Admin() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.adminList().then(setProblems).catch((e) => setError(e.message));

  useEffect(() => {
    if (user?.isAdmin) load();
  }, [user]);

  if (!user?.isAdmin) {
    return (
      <div className="container page">
        <div className="card">Доступ только для администраторов.</div>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("topic", form.topic);
      fd.append("difficulty", form.difficulty);
      fd.append("statement", form.statement);
      fd.append("options", JSON.stringify(form.options.split(",").map((s) => s.trim()).filter(Boolean)));
      fd.append("correctIndex", form.correctIndex);
      if (form.image) fd.append("image", form.image);

      await api.adminCreate(fd);
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Удалить задачу?")) return;
    await api.adminDelete(id);
    load();
  };

  return (
    <div className="container page">
      <h2 style={{ marginBottom: 20 }}>{t.admin.title}</h2>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, fontSize: 16 }}>{t.admin.addNew}</h3>
        <form onSubmit={submit}>
          <div className="field">
            <label>{t.admin.topic}</label>
            <input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} required />
          </div>
          <div className="field">
            <label>{t.admin.difficulty}</label>
            <input
              type="number"
              min={1}
              max={5}
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            />
          </div>
          <div className="field">
            <label>{t.admin.statement}</label>
            <textarea
              rows={3}
              value={form.statement}
              onChange={(e) => setForm({ ...form, statement: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label>{t.admin.options}</label>
            <input
              placeholder="12, 14, 16, 18"
              value={form.options}
              onChange={(e) => setForm({ ...form, options: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label>{t.admin.correctIndex}</label>
            <input
              type="number"
              min={0}
              value={form.correctIndex}
              onChange={(e) => setForm({ ...form, correctIndex: e.target.value })}
            />
          </div>
          <div className="field">
            <label>{t.admin.image}</label>
            <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
          </div>
          {error && <div className="error-text">{error}</div>}
          <button className="btn btn-primary" disabled={saving}>
            {t.admin.save}
          </button>
        </form>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>{t.admin.topic}</th>
              <th>{t.admin.statement}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {problems.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.topic}</td>
                <td style={{ maxWidth: 400 }}>{p.statement}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => remove(p.id)}>
                    {t.admin.delete}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
