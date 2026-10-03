"use client";

import React from "react";
import Image from "next/image";
import dynamic from 'next/dynamic';

const CADViewer = dynamic(() => import('./CADViewer'), { ssr: false });

export default function Mission() {
  return (
    <section id="mission" aria-labelledby="mission-title">
      <div className="mission-grid">
        <div className="mission-viewer">
          <CADViewer modelPath="/models/mechanical_arm-09-21-26.glb" />
        </div>
        <div className="mission-copy">
          <div className="mission-note">
            <Image
              src="/images/est2024.png"
              alt="Established in 2024"
              width={608}
              height={608}
              className="mission-stamp animate-rock"
            />
            <h2 id="mission-title">Our Mission</h2>
            <p>
              At <strong>WayBionic</strong>, we are developing a surgical robotic
              arm intended to let a surgeon operate remotely on a patient in
              space. Our student team brings mechanical design, electronics,
              software and biomedical thinking together to work toward precise,
              reliable, surgeon-controlled care.
            </p>
            <Image
              src="/images/pencilbionicnew.png"
              alt="WayBionic Mascot with Pencil"
              width={500}
              height={500}
              className="mission-mascot"
            />
          </div>
        </div>
      </div>
    </section>
  );
}