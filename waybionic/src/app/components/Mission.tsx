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
              At <strong>WayBionic</strong>, we strive to revolutionize remote
              surgery by developing a bionic arm inspired by the challenges of
              performing medical procedures in space. Our goal is to create
              innovative, reliable, and precise tools that empower both astronauts
              and doctors, whether in orbit or on Earth.
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