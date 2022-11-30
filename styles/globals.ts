import { globalCss } from "../stitches.config";

export const globalStyles = globalCss({
  '*': { margin: 0, padding: 0, boxSizing: 'border-box' },
  'html': {
    "@bp3": {
      fontSize: '93.75%'
    }, 
    "@bp2": {
      fontSize: '87.5%'
    }
  },
  'body': { 
    background: "$gray900",
    color: 'White'
  }
});

() => {
  return globalStyles();
}