import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./VirtualExperience.css";

export default function VirtualExperience() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(renderer.domElement);

    // Add light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create Kaaba
    const kaabaGeometry = new THREE.BoxGeometry(5, 5, 5);
    const kaabaMaterial = new THREE.MeshPhongMaterial({
      color: 0x000000,
      specular: 0x222222,
      shininess: 30,
    });
    const kaaba = new THREE.Mesh(kaabaGeometry, kaabaMaterial);
    scene.add(kaaba);

    // Create tawaf area
    const tawafGeometry = new THREE.RingGeometry(7, 14, 32);
    const tawafMaterial = new THREE.MeshBasicMaterial({
      color: 0xe0e0e0,
      side: THREE.DoubleSide,
    });
    const tawafArea = new THREE.Mesh(tawafGeometry, tawafMaterial);
    tawafArea.rotation.x = Math.PI / 2;
    scene.add(tawafArea);

    // Animation
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      kaaba.rotation.y += 0.005;

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="virtual-experience-container">
      <div className="experience-header">
        <h2>Virtual Kaaba Experience</h2>
        <p>Use mouse to rotate the view and scroll to zoom</p>
      </div>
      <div className="experience-canvas" ref={containerRef}></div>
    </div>
  );
}
