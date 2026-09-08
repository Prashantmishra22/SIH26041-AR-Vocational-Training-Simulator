using UnityEngine;

namespace JHSafetyAR.AR
{
    public class ARFallbackManager : MonoBehaviour
    {
        [SerializeField] private GameObject fallbackSceneRoot;
        [SerializeField] private Camera simulationCamera;
        [SerializeField] private Transform cameraOrbitTarget;
        [SerializeField] private float rotationSpeed = 50f;

        private void Start()
        {
            if (ARSessionManager.Instance != null && !ARSessionManager.Instance.IsARSupported)
            {
                ActivateFallbackMode();
            }
        }

        public void ActivateFallbackMode()
        {
            if (fallbackSceneRoot != null) fallbackSceneRoot.SetActive(true);
            if (simulationCamera != null) simulationCamera.gameObject.SetActive(true);
            Debug.Log("[ARFallbackManager] 3D Simulation Viewport running smoothly.");
        }

        private void Update()
        {
            // Optional touch swipe orbit controls for 3D simulation mode
            if (Input.touchCount == 1 && Input.GetTouch(0).phase == TouchPhase.Moved && cameraOrbitTarget != null)
            {
                Vector2 delta = Input.GetTouch(0).deltaPosition;
                simulationCamera.transform.RotateAround(cameraOrbitTarget.position, Vector3.up, delta.x * rotationSpeed * Time.deltaTime);
            }
        }
    }
}
