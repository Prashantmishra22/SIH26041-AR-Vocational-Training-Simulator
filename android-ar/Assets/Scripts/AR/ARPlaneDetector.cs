using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;

namespace JHSafetyAR.AR
{
    public class ARPlaneDetector : MonoBehaviour
    {
        [SerializeField] private ARRaycastManager raycastManager;
        [SerializeField] private GameObject placementIndicatorPrefab;

        private GameObject _indicatorInstance;
        private Pose _placementPose;
        private bool _hasValidPlacementPose = false;

        public bool HasValidSurface => _hasValidPlacementPose;
        public Pose CurrentPlacementPose => _placementPose;

        private void Start()
        {
            if (placementIndicatorPrefab != null)
            {
                _indicatorInstance = Instantiate(placementIndicatorPrefab);
                _indicatorInstance.SetActive(false);
            }
        }

        private void Update()
        {
            UpdatePlacementPose();
            UpdatePlacementIndicator();
        }

        private void UpdatePlacementPose()
        {
            if (raycastManager == null) return;

            var screenCenter = new Vector2(Screen.width * 0.5f, Screen.height * 0.5f);
            var hits = new List<ARRaycastHit>();
            raycastManager.Raycast(screenCenter, hits, TrackableType.PlaneWithinPolygon);

            _hasValidPlacementPose = hits.Count > 0;
            if (_hasValidPlacementPose)
            {
                _placementPose = hits[0].pose;

                var cameraForward = Camera.main.transform.forward;
                var cameraBearing = new Vector3(cameraForward.x, 0, cameraForward.z).normalized;
                _placementPose.rotation = Quaternion.LookRotation(cameraBearing);
            }
        }

        private void UpdatePlacementIndicator()
        {
            if (_indicatorInstance == null) return;

            if (_hasValidPlacementPose)
            {
                _indicatorInstance.SetActive(true);
                _indicatorInstance.transform.SetPositionAndRotation(_placementPose.position, _placementPose.rotation);
            }
            else
            {
                _indicatorInstance.SetActive(false);
            }
        }

        public void HideIndicator()
        {
            if (_indicatorInstance != null) _indicatorInstance.SetActive(false);
        }
    }
}
