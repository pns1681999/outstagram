import React from 'react';

export default function Placeholder() {
  return (
    
    <div className="preloader-wrapper big active"style={{margin:"0 48%" }} >
      <div class="spinner-layer spinner-green">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>
  );
}
