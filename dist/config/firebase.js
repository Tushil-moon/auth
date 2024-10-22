"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fireapp = void 0;
const app_1 = require("firebase-admin/app");
const config = {
    projectId: "angularchatapp-8b6c5",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC/lyGLsnQChsW4\nO+kOHqD10S30TNlH/3Gplb/We4lgEYXVVVRQMErBSOV16BvJx1z7gOS/kWGSPlOI\n4aYvPGe7gjJZNgugLfsOT4Dc3YYAd0P81zmvxD7xeOgWAeF42QLGWPckiuX6J3zG\neSOpKkEQ5sFON8wiPNW9z5HWO+j1q1MY/wD4dLW861qUh1DgRgCqoftwQ/5bK9gS\ncGFPex5Uj5XGGSFPhxWrMc1fhCufleqZOLmk+cCXQPZEPU9Q6v7Exo6d8Sbr/hQc\nuLfhQ6vvApp5C9OLvRW6xQPWXhKh9fikj86S+vMQAwgf1Mf3pJEaVVZMVrEikPYH\n42XevwnFAgMBAAECggEACch7V4lQwDJGlV5Fy8lHmdXJHXDxJWqHUMwLRDYBsUyj\nw118lS2qG42P3gHwrVCHUHZn99pCG7ggBtzS4hWZDGudC44lcNP4PmZT47NSHOL6\nL0aENRP1zNnKLBmDfGrEaAFx+UU4chojFnVoG0LDmMvXshlKTLNDjNI1FbXwct7q\nj0pPtoxpsKufNsuiSflHS8h6UvrUv5/ZtTfugIeUKQlM+G9mr+azXdVwBtBcDhx2\nULkjG5apn+N2UciE3/j/9D8ro1lpkrjrfbyxFNDRpUz6n1OHtOfUifXfcENsfeGw\nUBvmllY2sotQU3b+gq4/5gGBLPYEeRNoGGkfS3ZtwQKBgQDtFQ1vi+/8TC3UDpV6\naOtkny5GnfNt/frlXDz0nqHfOGI7kQvklVIG8uZNHt6qMIN+WsMfuG+0Rv4g9FfX\nAnPUTUjDsiFvgh105sCOWZs7DIM6lCkYyjOevnNCAe5PVdOZEkehA/NIhNMzrDOE\ndXv9NdPXAuz6XjGDM+0xXQ+b5QKBgQDO4M1/w3yittOkZuXvlmgq0r8Cn4Id9wVR\no+g/ovVEuU6Df35x1P12GqXbCUVR0PMaQyrp//y9hE+rQfxyCMkZxXitFeGfdZ7R\nREKvXMAU7Np9SL3ueTSYPWz/g9GB8eQqa7+6pAs4gQMDGBNmfiklOAyEpO2GVjml\nQQfv1+GYYQKBgQDIc3tXq9at1+8Lk4UY6WrVOa1Tsaqnfg1LLZCwNwugAzkzKfEH\nRKUFEQxdelNDTB9xjuXZhQSVRU0Kqe028nDiuLFkHNEeScIEHDIEaYjRBURTHAAf\nYJ8Cgf5Lefx3AZcVnhoH7qIc14kG8HribL73mTJSYbvh+BAe4aGTkh5nbQKBgQCq\nQfjeHVSF1VF5C/ZQp8gy9h6dWgkMADAwcGTDeqnAVYF4V4UIyfGPMX8uNQMHwp9Q\nDddTnYmzryCiITxR3UkkHJCkYk29nl+GelcnW335urRWR3eIu9e9M1BxOVtDRoAx\nKVwxjrBtYD/KXBYbU9ko+GfVAqc41925Uzvk+BaCAQKBgGxFe3/88PsHDclzxTvE\no/ZkLZys82MFsHZckEIHnd3Q8TQNJun8yWfxnObtPjUCUOtCOrhzJH1JGEBtKips\nNQ2R396H5Z4w4r0/NQoARWDPUFt44J3HFtWxpFGhbGl1ktEARDpu6f14lcf4pkUr\nRhmgA22BlObodtY0w5gVqQKa\n-----END PRIVATE KEY-----\n",
    clientEmail: "firebase-adminsdk-1q4f5@angularchatapp-8b6c5.iam.gserviceaccount.com",
};
exports.fireapp = (0, app_1.initializeApp)({
    credential: (0, app_1.cert)(config),
    projectId: config.projectId, // Alternatively, you can use "angularchatapp-8b6c5"
});
