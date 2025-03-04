import React, { useEffect, useState } from 'react';
import { fetchTranscript } from './api';
import PacmanLoader from "react-spinners/PacmanLoader";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import { toast } from "react-toastify";

const Board = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [transcript, setTranscript] = useState<{ start: string, text: string }[]>([]);

    const [plainText, setPlainText] = useState('')
    const [plainTrans, setPlainTrans] = useState('')
    const [error, setError] = useState('');
    const [geTranscript, setGetranscript] = useState(false)

    //Text
    const [transText, setTranstext] = useState(false)
    const [plainShowText, setPlainShowtext] = useState(false)
    const [summaryText, setSummarytext] = useState(false)

    //Copy 
    const [copied, setCopied] = useState(false);

    //Prompt
    const [promptForm, setPromptForm] = useState(false)
    const [promptMax, setPromptMax] = useState<number | string>('');
    const [promptMin, setPromptMin] = useState<number | string>('');
    const [promptFormat, setPromptFormat] = useState<string>('bullet');
    const [promptFinal, setPromptFinal] = useState<string>(' ');
    const [promptCreated, setpromptCreated] = useState(false)

    const handleMaxLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPromptMax(event.target.value);
    };
    const handleMinLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPromptMin(event.target.value);
    };
    const handleFormatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPromptFormat(event.target.value);
    };

    const createPrompt = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const promptBase = `Please provide a summary of the main topic and key points discussed in this YouTube transcript, focusing on the central theme and the key arguments made. Capture the overall mood and tone of the video—whether casual, formal, serious, or lighthearted—without diving into specific details or quotes. I’m looking for a well-rounded understanding of the video’s content, with a word count between ${promptMin} and ${promptMax} words.`;

        if (promptFormat === 'bullet') {
            setPromptFinal(`${promptBase} If listing any details or key events, please use bullet points. Transccript:--"${plainText}"`);
            setpromptCreated(true)

        } else {
            setPromptFinal(`${promptBase} If there are any key details or events, please include them in paragraph form. Transccript:--"${plainText}"`);
            setpromptCreated(true)
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(plainText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch((error) => {
            console.error('Failed to copy text: ', error);
        });
    };
    const copyTransToboard = () => {
        navigator.clipboard.writeText(plainTrans).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch((error) => {
            console.error('Failed to copy text: ', error);
        });
    };
    const copyPromToboard = () => {
        navigator.clipboard.writeText(promptFinal).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch((error) => {
            console.error('Failed to copy text: ', error);
        });
    };


    const extractVideoId = (url: string) => {
        const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const handleFetchTranscript = async (event: React.FormEvent) => {
        setGetranscript(true)
        event.preventDefault();
        const videoId = extractVideoId(videoUrl);

        if (!videoId) {
            setGetranscript(false)
            setError('Invalid YouTube URL');
            toast.error("Invalid YouTube URL")
            setTranscript([]);
            return;
        }

        try {
            const data = await fetchTranscript(videoId);
            setTranscript(data);
            setError('');
            setGetranscript(false)
            toast.success('Transcript Successful !')
            let para = data.map((item: { text: string, start: string }) => item.text).join(' ');
            setPlainText(para)

            let para1 = data.map((item: { text: string, start: string }) => item.start + " : " + item.text).join("\n");
            para1 = 'Time : Text\n' + para1
            setPlainTrans(para1);

        } catch (err) {
            setGetranscript(false)
            setError('Failed to fetch transcript');
            toast.error('Failed to fetch transcript !')
            setTranscript([]);
        }
    };

    useEffect(() => {
        // Fetch the current tab URL  
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
            const currentTabUrl = tabs[0].url; 
        // const currentTabUrl = "https://www.youtube.com/watch?v=MNeX4EGtR5Y&t=7s";
        if (currentTabUrl && currentTabUrl.includes("youtube.com")) {
            setVideoUrl(currentTabUrl); // Setting the video URL  
        } else {
            alert("Please open a YouTube video to fetch the transcript.");
            toast.warning('Please open a Youtube video')
        }
        });
    }, []);


    return (
        <div className='relative font-quicksand pt-2  text-lg'>
            <div className=' text-black relative'>
                <img src='https://res.cloudinary.com/dm1dnfpng/image/upload/v1740121605/head2_jdedca.jpg' alt="" className='w-full h-40 object-cover' />

                <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-transparent p-4 text-center z-10 flex items-center justify-start">
                    <h1 className='text-white text-3xl'>Lyric Vault</h1>
                </div>

                <div className='absolute  bottom-0 z-10 w-full'>
                    <div className='flex justify-center '>

                        <div className='flex justify-center  w-auto '>
                            <div className='px-2 m-2 border border-gray-300 rounded-2xl w-auto flex justify-center items-center h-12'>
                                {geTranscript ? (
                                    <div className='flex items-center space-x-2  w-60'>
                                        <p className='text-white font-bold'>Fetching Transcript</p>
                                        <PacmanLoader
                                            color={'white'}
                                            size={15}
                                            aria-label="Loading Spinner"
                                            data-testid="loader"
                                        />
                                    </div>
                                ) : (
                                    <button onClick={handleFetchTranscript}>
                                        <div className='flex text-white cursor-pointer'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                                            </svg>
                                            <p className='px-1 text-lg'>Get</p>
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {promptForm === true ?
                <div className='flex justify-center  w-auto'>
                    <div className=' w-auto flex justify-center items-center h-13 text-xl'>
                        <p
                            className='cursor-pointer p-2 hover:bg-blue-900 duration-300 border-b-2 border-slate-800 m-0.2 outline-none hover:border-white hover:border-b-2'>Prompt Creation</p>
                    </div>
                </div> :
                <div className='flex justify-center  w-auto'>
                    <div className=' w-auto flex justify-center items-center h-13 text-xl'>
                        <p
                            onClick={() => { setTranstext(true); setPlainShowtext(false); setSummarytext(false) }}
                            className='cursor-pointer p-2 hover:bg-blue-900 duration-300 border-b-2 border-slate-800 m-0.2 outline-none hover:border-white hover:border-b-2'>Transcript</p>
                        <p
                            onClick={() => { setTranstext(false); setPlainShowtext(true); setSummarytext(false) }}
                            className='cursor-pointer p-2 hover:bg-blue-900 duration-300 border-b-2 border-slate-800 m-0.2 outline-none hover:border-white hover:border-b-2'>Plain Text</p>
                        <p
                            onClick={() => { setTranstext(false); setPlainShowtext(false); setSummarytext(true) }}
                            className='cursor-pointer p-2 hover:bg-blue-900 duration-300 border-b-2 border-slate-800 m-0.2 outline-none hover:border-white hover:border-b-2'>Summary</p>
                    </div>
                </div>
            }

            {error && <p className='hidden '>{error}</p>}
            {transText === true && promptForm === false &&
                <div className='max-w-200 p-1'>
                    <div className='flex justify-center w-full'>
                        <div className='ml-auto' onClick={copyTransToboard}>
                            {copied === false ?
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                    </svg>
                                </div>
                                :
                                <div className='text-green-500 flex'>
                                    <p className='text-sm italic '>Copied</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                                    </svg>
                                </div>
                            }
                        </div>
                    </div>
                    <div className=" overflow-y-auto h-[300px] p-2 bg-slate-900 rounded-2xl [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-2xl">
                        <table className="min-w-full table-auto border-separate border-spacing-0 ">
                            <thead>
                                <tr className="bg-slate-700 text-white">
                                    <th className="px-1 py-2 text-left">Time</th>
                                    <th className="px-1 py-2 text-left">Text</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transcript.length > 0 &&
                                    transcript.map((item, index) => (
                                        <tr key={index} className="border-b border-slate-200 hover:bg-slate-800 duration-100">
                                            <td className="px-2 py-1 text-white">{item.start}</td>
                                            <td className="px-2 py-1 text-white">{item.text}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>}
            {plainShowText === true && promptForm === false &&
                <div className='max-w-200'>
                    <div className='flex justify-center w-full'>
                        <div className='ml-auto' onClick={copyToClipboard}>
                            {copied === false ?
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                    </svg>
                                </div>
                                :
                                <div className='text-green-500 flex'>
                                    <p className='text-sm italic '>Copied</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                                    </svg>
                                </div>
                            }
                        </div>
                    </div>

                    <div className=" overflow-y-auto h-[300px] p-4 bg-slate-900 rounded-2xl [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-2xl">
                        <div className="min-w-full table-auto border-separate border-spacing-0 ">
                            {plainText}
                        </div>
                    </div>
                </div>}
            {summaryText === true && promptForm === false &&
                <div className='max-w-200 p-5'>
                    <div className=" overflow-y-auto h-[300px] p-4 bg-slate-900 rounded-2xl [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-2xl">
                        <div className="min-w-full table-auto border-separate border-spacing-0 ">
                            <div className='flex justify-center '>
                                <ClimbingBoxLoader
                                    color={'white'}
                                    size={15}
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
                                />
                            </div>
                            <div className='flex justify-center text-teal-500 font-bold '>
                                <h1 className='text-2xl'> AI summary Not available at the moment</h1>
                            </div>
                            {plainTrans !== '' &&
                            <div>
                                <button
                                    onClick={() => { setPromptForm(true) }}
                                    className='mt-5 bg-teal-700 p-2 rounded-2xl hover:text-teal-400 hover:bg-slate-900 border-2 border-slate-800 hover:border-teal-400 duration-200 '>Get Prompt ?</button>
                            </div> 
                            }
                        </div>
                    </div>
                </div>}
            {promptForm === true &&
                <div className='max-w-200 p-5'>
                    <div className=" overflow-y-auto h-[300px] p-4 bg-slate-900 rounded-2xl [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-2xl">
                        <div className="min-w-full table-auto border-separate border-spacing-0 ">
                            <div className='flex justify-center '>
                                <div className='flex'>
                                    <div>
                                        <form onSubmit={createPrompt}> 
                                            <label className=''>Max Length (words)</label>
                                            <br />
                                            <input
                                                type="number"
                                                className='bg-slate-700 outline-0 border-1 p-1 rounded-2xl px-3'
                                                placeholder='250'
                                                required
                                                value={promptMax}
                                                onChange={handleMaxLengthChange}
                                            />
                                            <br />

                                            <label className=''>Min Length (words)</label>
                                            <br />
                                            <input
                                                type="number"
                                                className='bg-slate-700 outline-0 border-1 p-1 rounded-2xl px-3'
                                                placeholder='250'
                                                required
                                                value={promptMin}
                                                onChange={handleMinLengthChange}
                                            />
                                            <br />

                                            <label>Format</label>
                                            <br />
                                            <select
                                                className='bg-slate-700 outline-0 border-1 p-1 rounded-lg px-3 w-full '
                                                value={promptFormat}
                                                onChange={handleFormatChange}
                                            >
                                                <option value="bullet">Bullet form</option>
                                                <option value="paragraph">Paragraph form</option>
                                            </select>

                                            <button
                                                type="submit"
                                                className=' mt-3 bg-teal-700 p-2 rounded-2xl hover:text-teal-400 hover:bg-slate-900 border-2 border-slate-800 hover:border-teal-400 duration-200 flex'
                                            >
                                                Create Prompt
                                            </button>
                                        </form>
                                    </div>
                                    <button
                                        onClick={() => { setPromptForm(false) }}
                                        className='h-12 ml-auto mt-5 bg-teal-700 p-2 rounded-2xl hover:text-teal-400 hover:bg-slate-900 border-2 border-slate-800 hover:border-teal-400 duration-200 flex'>
                                        Close
                                        <p className='px-2 bg-slate-900 rounded-full text-red-500'>X</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            {promptCreated === true &&
                <div
                    className="absolute top-0 bottom-0 left-0 z-10 p-4"
                    style={{ backgroundColor: "rgba(148, 163, 184, 0.2)" }}
                >
                    <div className=" overflow-y-auto h-[500px] p-4 bg-slate-900 rounded-2xl [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-2xl">
                        <div className="min-w-full table-auto border-separate border-spacing-0 ">
                            <div className='flex justify-center items-center'> 
                                <button
                                    onClick={() => { setpromptCreated(false) }}
                                    className='mt-5 bg-teal-700 p-2 rounded-2xl hover:text-teal-400 hover:bg-slate-900 border-2 border-slate-800 hover:border-teal-400 duration-200 flex'>
                                    Close
                                    <p className='px-2 bg-slate-900 rounded-full text-red-500'>X</p>
                                </button>
                                <h2 className='text-2xl'>Prompt Preview:</h2>
                            </div>
                            <div className='flex justify-center '> <div className='ml-auto' onClick={copyPromToboard}>
                                {copied === false ?
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                        </svg>
                                    </div>
                                    :
                                    <div className='text-green-500 flex'>
                                        <p className='text-sm italic '>Copied</p>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                                        </svg>
                                    </div>
                                }
                            </div>

                            </div>
                            <div className='flex justify-center text-lg'>
                                {promptFinal}
                            </div> 
                        </div>
                    </div>
                </div>}

        </div>
    );
};

export default Board;