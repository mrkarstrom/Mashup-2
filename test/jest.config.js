export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest', 
  },
  extensionsToTreatAsEsm: ['.js'], 
};
