const express = require('express');
const app = express();
const port = 3000;

const outdoorCosts = {
    P6: { panelCost: 730, rsaCardCost: 130, controllerCost: 100, powerSupplyCost: 150, miscellaneousCost: 300, panelFrameCost: 350, marketRate: 4500 },
    P5: { panelCost: 1080, rsaCardCost: 130, controllerCost: 100, powerSupplyCost: 150, miscellaneousCost: 300, panelFrameCost: 350, marketRate: 4466 },
    P4: { panelCost: 1230, rsaCardCost: 130, controllerCost: 100, powerSupplyCost: 150, miscellaneousCost: 300, panelFrameCost: 350, marketRate: 5500 },
    P4_PRO: { panelCost: 1350, rsaCardCost: 130, controllerCost: 100, powerSupplyCost: 150, miscellaneousCost: 300, panelFrameCost: 350, marketRate: 5222 },
    P3_076_PRO: { panelCost: 2240, rsaCardCost: 130, controllerCost: 100, powerSupplyCost: 150, miscellaneousCost: 300, panelFrameCost: 350, marketRate: 7714 }
};

const indoorCosts = {
    P2_5: { panelCost: 1320, rsaCardCost: 130, controllerCost: 100, powerSupplyCost: 150, miscellaneousCost: 300, panelFrameCost: 350, marketRate: 7000 },
    P3: { panelCost: 952, rsaCardCost: 130, controllerCost: 100, powerSupplyCost: 150, miscellaneousCost: 300, panelFrameCost: 350, marketRate: 4107.6 },
    P4: { panelCost: 1230, rsaCardCost: 130, controllerCost: 100, powerSupplyCost: 150, miscellaneousCost: 300, panelFrameCost: 350, marketRate: 4886 }
};

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/calculate', (req, res) => {
    const { screenType, screenSize, panelCost, rsaCardCost, controllerCost, powerSupplyCost, miscellaneousCost, panelFrameCost } = req.body;

    const numberOfPanels = screenSize * 2; // 2 panels per square foot
    const totalPanelCost = panelCost * numberOfPanels;
    const totalRsaCardCost = rsaCardCost * screenSize;
    const totalControllerCost = controllerCost * screenSize;
    const totalPowerSupplyCost = powerSupplyCost * screenSize;
    const totalMiscellaneousCost = miscellaneousCost * screenSize;
    const totalPanelFrameCost = panelFrameCost * screenSize;

    const totalCogs = totalPanelCost + totalRsaCardCost + totalControllerCost + totalPowerSupplyCost + totalMiscellaneousCost + totalPanelFrameCost;
    const minSellingPrice = totalCogs * 1.3; // 30% profit margin
    const maxSellingPrice = totalCogs * 1.5; // 50% profit margin

    const marketRate = screenType in outdoorCosts ? outdoorCosts[screenType].marketRate : indoorCosts[screenType].marketRate;
    const totalMarketRate = marketRate * screenSize;

    const totalCostBreakdown = {
        totalPanelCost,
        totalRsaCardCost,
        totalControllerCost,
        totalPowerSupplyCost,
        totalMiscellaneousCost,
        totalPanelFrameCost
    };

    res.render('index', {
        screenType,
        screenSize,
        totalCogs,
        minSellingPrice,
        maxSellingPrice,
        marketRate,
        totalMarketRate,
        totalCostBreakdown,
        numberOfPanels
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});