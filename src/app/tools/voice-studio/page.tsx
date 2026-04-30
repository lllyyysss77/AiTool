import { redirect } from 'next/navigation';

export default function VoiceStudioPage() {
    redirect('/tools/api-lab?capability=tts');
}
