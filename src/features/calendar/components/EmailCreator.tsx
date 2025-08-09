'use client';

import InputText from '@/components/input/input-text';
import { addPostEvent } from '@/features/common/postSlice';
import { useAppDispatch } from '@/lib/hooks';
import axios from 'axios';
import React, { useState } from 'react';

export default function EmailCreator() {
  const dispatch = useAppDispatch();

  const INITIAL_EMAIL_OBJ = {
    from: '',
    subject: '',
    textContent: '',
  };

  const [emailObj, setEmailObj] = useState(INITIAL_EMAIL_OBJ);
  const [to, setTo] = useState<string[]>([]);
  const [html, setHtml] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateFormValue = (updateType: string, value: string) => {
    setEmailObj({ ...emailObj, [updateType]: value });
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);

    if (!emailObj.from || !to.length || !emailObj.subject) {
      setError('From, To, and Subject fields are required.');
      return;
    }

    setLoading(true);

    try {
      const d = new Date();
      let h = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
      let m = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
      const time = h + ':' + m;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/send-email`,
        {
          from: emailObj.from,
          to: to,
          subject: emailObj.subject.toString(),
          textContent: emailObj.textContent,
          html: html.toString(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        dispatch(addPostEvent({ platform: 'email', time }));
        setSuccess(true);
        setEmailObj(INITIAL_EMAIL_OBJ);
        setTo([]);
        setHtml('');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-96 h-screen">
      <div className="overflow-y-auto overscroll-contain px-8 pb-24">
        <InputText
          type="text"
          defaultValue={emailObj.from}
          updateType="from"
          containerStyle="mt-2"
          labelTitle="From"
          placeholder="From"
          updateFormValue={updateFormValue}
        />

        <div>
          <label className="label text-sm text-secondary pt-4">To</label>
          <textarea
            placeholder="receiving emails ...."
            className="border border-gray-500 text-secondary rounded-lg block p-2 h-32 w-full text-sm resize-none bg-transparent focus:outline-none"
            value={to.join(',')}
            onChange={(e) =>
              setTo(e.target.value.split(',').map((t) => t.trim()))
            }
          />
        </div>

        <InputText
          type="text"
          defaultValue={emailObj.subject}
          updateType="subject"
          containerStyle="mt-2"
          labelTitle="Subject"
          placeholder="Subject"
          updateFormValue={updateFormValue}
        />

        <InputText
          type="text"
          defaultValue={emailObj.textContent}
          updateType="textContent"
          containerStyle="mt-2"
          labelTitle="Text Content"
          placeholder="Text Content"
          updateFormValue={updateFormValue}
        />

        <div className="form-control">
          <label className="label text-sm text-secondary pt-4">Add Html</label>
          <textarea
            placeholder="Html goes here ...."
            className="border border-gray-500 text-secondary rounded-lg block p-2 h-32 w-full text-sm resize-none bg-transparent focus:outline-none"
            value={html}
            onChange={(e) => setHtml(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && (
          <p className="text-green-600 mt-4">Email sent successfully!</p>
        )}

        <div className="modal-action">
          <button
            className="btn btn-primary px-6 w-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
