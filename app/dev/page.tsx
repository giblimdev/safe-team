import React from 'react';
import IdeaManager from '../components/IdeaManagement'
//import Link from 'next/link';
//import CompTest from '../components/CompTest';
import Link from 'next/link';
import ShowIdeas from './components/ShowIdeas';

function page() {
  return (
    <div>
      <div>
<Link href={"https://safe-team-giblimdevs-projects.vercel.app/"}>
https://safe-team-giblimdevs-projects.vercel.app/</Link>
      </div>
   {/*  <IdeaManager /> 
    <CompTest />
  */}
  <ShowIdeas/>
    </div>
  )
}

export default page