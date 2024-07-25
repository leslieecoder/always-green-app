"use client";
import React, { useEffect } from 'react';
import { useParams, useSearchParams} from 'next/navigation';

export default function Page() {
  const params = useParams();
const algo = useSearchParams()

  useEffect(() => {
    console.log(params);
    console.log(algo.get("id"))
  }, [params]);

  return (
    <div>1234</div>
  );
}
