# Regenerates deploy.sh (the Cloud Shell paste-and-run file) from the real files, so the two can never drift. Run: python3 server/build_deploy.py
import pathlib
d=pathlib.Path(__file__).parent
parts=[('firebase.json','firebase.json'),('.firebaserc','.firebaserc'),('functions/package.json','functions/package.json'),('functions/index.js','functions/index.js'),('functions/pay.js','functions/pay.js')]
out='#!/bin/bash\n# Cloud Shell에 통째로 붙여넣고 실행: 서버 함수 파일 생성 후 배포 (server/build_deploy.py가 만든 파일, 직접 고치지 말 것)\nset -e; mkdir -p ~/bpt/functions && cd ~/bpt\n'
for i,(src,dst) in enumerate(parts,1):
    body=(d/src).read_text(encoding='utf-8').rstrip('\n')
    out+=f'cat > {dst} <<"EOF{i}"\n{body}\nEOF{i}\n'
out+='(cd functions && npm install --silent)\nfirebase deploy --only functions --project my-bungeoppang-tycoon\n'
(d/'deploy.sh').write_text(out,encoding='utf-8')
