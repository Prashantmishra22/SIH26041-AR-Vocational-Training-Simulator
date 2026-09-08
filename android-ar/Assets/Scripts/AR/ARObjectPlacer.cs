using UnityEngine;

namespace JHSafetyAR.AR
{
    public class ARObjectPlacer : MonoBehaviour
    {
        [SerializeField] private ARPlaneDetector planeDetector;
        [SerializeField] private GameObject spawnedEnvironmentRoot;

        public bool IsEnvironmentPlaced { get; private set; } = false;

        public GameObject PlaceEnvironmentPrefab(GameObject prefab)
        {
            if (prefab == null || planeDetector == null || !planeDetector.HasValidSurface)
            {
                Debug.LogWarning("[ARObjectPlacer] Cannot place environment: invalid surface or null prefab.");
                return null;
            }

            if (spawnedEnvironmentRoot != null)
            {
                Destroy(spawnedEnvironmentRoot);
            }

            Pose pose = planeDetector.CurrentPlacementPose;
            spawnedEnvironmentRoot = Instantiate(prefab, pose.position, pose.rotation);
            IsEnvironmentPlaced = true;

            planeDetector.HideIndicator();
            Debug.Log($"[ARObjectPlacer] Placed industrial safety training environment at: {pose.position}");
            return spawnedEnvironmentRoot;
        }

        public void ResetPlacement()
        {
            if (spawnedEnvironmentRoot != null)
            {
                Destroy(spawnedEnvironmentRoot);
                spawnedEnvironmentRoot = null;
            }
            IsEnvironmentPlaced = false;
        }
    }
}
