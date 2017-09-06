Tasks
=====

 * Have indicator showing where exit is.
 * Draw muted exit on top of shadows?
 * Implement progression system:
    * Start level at 2x2, then increase in size logarithmically?
    * Have a low probability of a node having 1 enemy, scale up
    * Increase the difficulty of enemies:
        * For shooter enemies, increase frequency and/or clip size of gun and/or reload time.
        * For proximity mines, make them chase longer, move faster (up to the player's speed)
 * Enemies:
    * Shooter: Have a clip size, frequency of shots, reload time, accuracy.
    * Proximity Mine: Activates if within certain AOE of player.  Slowly increases in speed over a period of N seconds, then explodes.
        * Can damage other enemies and player.
        * AOE can increase for difficulty
        * Chase time can increase for difficulty.
 * Possible Items:
    * HP/Light regen: Dan thinks this would ruin the horror element.  So maybe not.
    * Minimap for N seconds.
    * Shield for N seconds.
    * Drops bombs every N seconds for T seconds, damages enemies.
    * Speed Boost?
 * Possible Nodes:
    * Protection Node: No enemies may spawn here.  Bullets cannot penetrate.
 * Sound Effects:
    * On new level
    * On damage
    * On death
    * On item pickup
 * Use Object pools to prevent garbage collection
 * Make the player HP more apparent.
 * Show current/max score in title bar
 * Mobile Support
    * Press and drag in a direction for movement.
 * Soft Shadows
 * Make light waver more when you're at low health.
 * Make light slightly red/muted at low health.
 * Fix some audio bugs.
 * Radiosity
 * Pick a title, I guess

## Done
 * Music by Dan
    * Make it pan left/right based on the exit being left/right of you.
    * Make it increase/decrease in volume based on distance and/or health.
