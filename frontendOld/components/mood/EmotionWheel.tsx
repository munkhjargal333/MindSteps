'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DashboardStats } from '@/lib/types';
import * as THREE from 'three';

export const EmotionWheel = ({ data }: { data: DashboardStats['plutchik_wheel'] }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<DashboardStats['plutchik_wheel'][0] | null>(null);

  useEffect(() => {
    if (!mountRef.current || !data.length) return;

    // --- 1. SCENE SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 2, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // --- 2. LIGHTING (Премиум харагдуулах гол нууц) ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x8b5cf6, 1.5, 15);
    pointLight.position.set(0, 3, 2);
    scene.add(pointLight);

    const group = new THREE.Group();
    const petalMeshes: THREE.Mesh[] = [];

    // --- 3. CREATING PETALS (Дэлбээ зурах) ---
    data.forEach((emotion, i) => {
      const angle = (i / data.length) * Math.PI * 2;
      
      // Дэлбээний хэлбэр (Shape)
      const shape = new THREE.Shape();
      const length = 1.5 + (emotion.count * 0.2); // Count-аас хамаарч уртасна
      const width = 0.6;

      shape.moveTo(0, 0);
      shape.bezierCurveTo(width, length * 0.2, width, length * 0.8, 0, length);
      shape.bezierCurveTo(-width, length * 0.8, -width, length * 0.2, 0, 0);

      const extrudeSettings = {
        depth: 0.2,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.05,
        bevelSegments: 5
      };

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(emotion.color),
        shininess: 100,
        transparent: true,
        opacity: emotion.count > 0 ? 0.9 : 0.3,
        emissive: new THREE.Color(emotion.color),
        emissiveIntensity: 0.2
      });

      const petal = new THREE.Mesh(geometry, material);
      
      // Байрлал
      petal.rotation.z = angle - Math.PI / 2;
      petal.rotation.x = -Math.PI / 8; // Бага зэрэг дээшээ дэлбээлсэн мэт
      petal.userData = { emotion };
      
      group.add(petal);
      petalMeshes.push(petal);
    });

    scene.add(group);

    // --- 4. ANIMATION & INTERACTION ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const animate = () => {
      const id = requestAnimationFrame(animate);
      group.rotation.z += 0.003; // Зөөлөн эргэлт
      renderer.render(scene, camera);
      return id;
    };
    const animId = animate();

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [data]);

  return (
    <div className="relative w-full h-[400px]">
      <div ref={mountRef} className="w-full h-full cursor-pointer" />
      {/* Tooltip хэсгийг энд нэмж болно */}
    </div>
  );
};