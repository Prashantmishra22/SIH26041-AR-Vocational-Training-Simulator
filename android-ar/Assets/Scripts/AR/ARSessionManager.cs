using System;
using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;

namespace JHSafetyAR.AR
{
    public class ARSessionManager : MonoBehaviour
    {
        public static ARSessionManager Instance { get; private set; }

        [SerializeField] private ARSession arSession;
        [SerializeField] private ARPlaneManager arPlaneManager;
        [SerializeField] private ARRaycastManager arRaycastManager;
        [SerializeField] private GameObject fallbackSimulatorRoot;

        public event Action<bool> OnARAvailabilityChecked;

        public bool IsARSupported { get; private set; } = false;
        public bool IsPlaneDetected { get; private set; } = false;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
        }

        private void Start()
        {
            CheckARAvailability();
        }

        public async void CheckARAvailability()
        {
            if (ARSession.state == ARSessionState.None || ARSession.state == ARSessionState.CheckingAvailability)
            {
                await ARSession.CheckAvailability();
            }

            IsARSupported = (ARSession.state >= ARSessionState.Ready);
            Debug.Log($"[ARSessionManager] ARCore Availability: {ARSession.state} (Supported: {IsARSupported})");

            if (!IsARSupported)
            {
                EnableFallbackSimulationMode();
            }

            OnARAvailabilityChecked?.Invoke(IsARSupported);
        }

        public void EnableFallbackSimulationMode()
        {
            Debug.Log("[ARSessionManager] Activating 3D Touch Simulation Fallback Mode for devices without ARCore.");
            if (arSession != null) arSession.enabled = false;
            if (fallbackSimulatorRoot != null) fallbackSimulatorRoot.SetActive(true);
        }

        public void SetPlaneDetection(bool enabled)
        {
            if (arPlaneManager != null)
            {
                arPlaneManager.enabled = enabled;
                foreach (var plane in arPlaneManager.trackables)
                {
                    plane.gameObject.SetActive(enabled);
                }
            }
        }
    }
}
