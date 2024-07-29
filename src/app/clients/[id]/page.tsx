"use client";
import React, { useEffect } from 'react';
import { useParams, useSearchParams} from 'next/navigation';

export default function Page() {
  const params = useParams();


  useEffect(() => {
    console.log(params);

  }, [params]);

  return (
    <div>1234</div>
  );
}
