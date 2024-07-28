import InputText from '@/components/input/input-text';
import TextArea from '@/components/input/text-area';
import axios from 'axios';
import React, { useState } from 'react';

export default function EmailCreator() {
  const INITIAL_EMAIL_OBJ = {
    from: '',
    subject: '',
    textContent: '',
  };
  const [emailObj, setEmailObj] = useState(INITIAL_EMAIL_OBJ);
  const [to, setTo] = useState<string[]>([]);
  const [html, setHtml] = useState<string>('');
  const updateFormValue = (updateType: string, value: string) => {
    setEmailObj({ ...emailObj, [updateType]: value });
  };

  const handleSubmit = () => {
    const response = axios.post(
      'http://localhost:5000/send-email',
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
  };

  return (
    <div className="grid grid-cols-2 h-screen">
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

        <div className="">
          <label className="label text-sm text-white pt-4">TO</label>
          <textarea
            placeholder="receiving emails ...."
            className="border border-gray-500 text-white rounded-lg block w-full p-2 h-32 w-full text-sm text-white resize-none bg-transparent focus:outline-none"
            onChange={(e) => setTo(e.target.value.split(','))}
            required
          />
        </div>
        <InputText
          type="subject"
          defaultValue={emailObj.subject}
          updateType="subject"
          containerStyle="mt-2"
          labelTitle="Subject"
          placeholder="Subject"
          updateFormValue={updateFormValue}
        />
        <InputText
          type="subject"
          defaultValue={emailObj.textContent}
          updateType="textContent"
          containerStyle="mt-2"
          labelTitle="Text Content"
          placeholder="Text Content"
          updateFormValue={updateFormValue}
        />
        <div className="form-control">
          <label className="label text-sm text-white pt-4">Add Html</label>
          <textarea
            placeholder="Html goes here ...."
            className="border border-gray-500 text-white rounded-lg block w-full p-2 h-32 w-full text-sm text-white resize-none bg-transparent focus:outline-none"
            onChange={(e) => setHtml(e.target.value)}
            required
          />
        </div>
        <div className="modal-action">
          <button className="btn btn-primary px-6" onClick={handleSubmit}>
            Post
          </button>
        </div>
      </div>
      <div className="bg-white"></div>
    </div>
  );
}
