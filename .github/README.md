# eKOSORA Backend CI Worflows

The current deployment solution (cyclic.sh) can not access organization repositories therefore the [ci.yaml](./workflows/ci.yaml) worflow pushes the code to [IVainqueur's Repository](https://github.com/IVainqueur/eKOSORA_backend) so that cyclic can update the deployment instance.
