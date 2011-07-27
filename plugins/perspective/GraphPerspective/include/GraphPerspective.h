#ifndef GRAPHPERSPECTIVE_H
#define GRAPHPERSPECTIVE_H

#include <tulip/Perspective.h>

class GraphHierarchiesModel;
class GraphHierarchiesEditor;

namespace Ui {
class GraphPerspectiveMainWindowData;
}

class GraphPerspective : public tlp::Perspective {
  Q_OBJECT

  Ui::GraphPerspectiveMainWindowData *_ui;

  GraphHierarchiesModel *_graphs;
  GraphHierarchiesEditor *_graphsEditor;

public:
  GraphPerspective(tlp::PerspectiveContext &c);
  virtual void construct(tlp::PluginProgress *);

public slots:
  void showGraphHierarchyEditor();
};

#endif // GRAPHPERSPECTIVE_H
